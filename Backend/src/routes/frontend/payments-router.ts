import { Router, Request, Response } from 'express';
import { verifyToken } from '../../authorization';
import { PaymentsService } from '../../services/payments-service';
import { PeriodicPaymentsService } from '../../services/periodicPayments-service';
import { CurriculumService } from '../../services/curriculum-service';
import { TossPaymentsService } from '../../services/toss-payments-service';
import { AligoService } from '../../services/aligo-service';
import { EmailService } from '../../services/email-service';
import { MemberService } from '../../services/member-service';

import { Payments } from '../../model/payments';
import Logger from '../../loaders/logger';

const router = Router();

router.use('/log', verifyToken);
router.post('/log', async (request: Request, response: Response) => {
	const log: string = request.body.log;
	
	try{
		Logger.info(log);
		console.log(log);
		response.status(200).send('success');
	}catch(err) {
		console.log(err);
		response.status(400).send('payment log error');
	}
});

router.use('/requestPayment', verifyToken);
router.post('/requestPayment', async (request: Request, response: Response) => {
	//일반 결제로만 호출되는 함수.
	const paymentsService = new PaymentsService();
	const tossPaymentsService = new TossPaymentsService();
	const orderId: string = request.body.orderId;
	const paymentKey: string = request.body.paymentKey;
	const amount: string = request.body.amount;
		
	let bank_account_number = '';
	let bank_name= '';
	let bank_account_holder = '';
	
	try{
		// paymentKey로 결제 조회.
		const payment = await tossPaymentsService.getPayment(paymentKey, 'domestic_general');	
		if(payment.status !== 'IN_PROGRESS') {
			response.status(400).send('request payment error');
			return;
		}

		const paymentId = payment.metadata.payment_id;
		const payments = await paymentsService.findById(paymentId) as any;
		if(!payments) {
			response.status(400).send('payment data not found');
			return;
		}
		
		/*
		if(payments.final_price !== parseInt(amount)) { //가격이 다른 경우.
			response.status(400).send('price is not match');
			return;
		}
		*/

		// 일반 결제 승인요청
		const data = await tossPaymentsService.approvePayment(paymentKey, orderId, parseInt(amount), 'domestic_general');
		if(!data) {
			response.status(400).send('approve payment error');
			return;
		}

		if(payment.metadata.payment_method == 'VIRTUAL_ACCOUNT') {
			bank_account_number = data.virtualAccount.accountNumber;
			bank_name = data.virtualAccount.bankCode;
			bank_account_holder = data.virtualAccount.customerName;
		}

		await paymentsService.update(paymentId, {
			status: payment.metadata.payment_method !== 'VIRTUAL_ACCOUNT' ? 20 : 10, //가상 계좌는 결제 완료로 처리하지 않는다.
			payment_method: data.metadata.payment_method.toLowerCase(),
			pg_pay_no: paymentKey,
			payment_date: new Date(),
			bank_account_number: bank_account_number,
			bank_name: bank_name,
			bank_account_holder: bank_account_holder,
		});
		
		response.status(200).send('success');
		//response.status(200).send(data);
	}catch(err) {
		console.log(err);
		response.status(400).send('request payment error');
	}
});

router.use('/requestPeriodicPayment', verifyToken);
router.post('/requestPeriodicPayment', async (request: Request, response: Response) => {
	const memberService = new MemberService();
	const paymentsService = new PaymentsService();
	const periodicPaymentsService = new PeriodicPaymentsService();
	const tossPaymentsService = new TossPaymentsService();
	const customerKey: string = request.body.customerKey;
	const authKey: string = request.body.authKey;
	const cardNumber: string = request.body.cardNumber;
	const cardExpirationYear: string = request.body.cardExpirationYear;
	const cardExpirationMonth: string = request.body.cardExpirationMonth;
	const aligoService = new AligoService();
	const emailService = new EmailService();

	try{
		const paymentData = await paymentsService.findById(parseInt(customerKey)) as any;
		if(!paymentData) {
			response.status(400).send('payments not found');
			return;
		}

		//빌링키 요청.
		let data;
		if(paymentData.payment_type === 10) { //국내 결제.
			Logger.info(`국내 결제`);
			data = await tossPaymentsService.requestBillingKey(customerKey, authKey, paymentData.payment_type === 10 ? 'domestic_subscription' : 'international');
			if(!data) {
				Logger.info(`국내 결제 빌링키 오류`);
				response.status(400).send('manage billing key error');
				return;
			}
		}else{ //해외 결제.
			Logger.info(`해외 결제`);
			data = await tossPaymentsService.requestBillingKeyForInternational(customerKey, cardNumber, cardExpirationYear, cardExpirationMonth);
			if(!data) {
				Logger.info(`해외 결제 빌링키 오류`);
				response.status(400).send('manage international billing key error');
				return;
			}
		}

		Logger.info(`빌링키 생성 완료 ${data.billingKey}`);

		//정기 결제 데이터 미리 만들어놓기.
		const created_date = new Date();
		const payment_date = new Date();
		for(let i = 0; i < paymentData?.curriculum?.months!; i++) {
			await periodicPaymentsService.create({
				member_id: paymentData.member_id,
				payments_id: paymentData.id!,
				price: paymentData.monthly_price,
				status: 10, //결제 전으로 처리. (첫 결제도 스케줄러에서 처리)
				payment_date: payment_date,
				is_deleted: 'N',
				error_log: '',
				created_date: created_date,
			});
			payment_date.setMonth(payment_date.getMonth() + 1);
		}

		await paymentsService.update(parseInt(customerKey), {
			status: 20, //결제 완료.
			payment_method: 'card',
			billing_key: data.billingKey,
			payment_date: new Date(),
		});


		// 관리자 알림 발송
		if (process.env.NODE_ENV !== 'development') {
			await aligoService.sendKakao({
				phone: '01051321404',
				code: 'TH_8112',
				content: `${paymentData?.member?.name}님이 ${paymentData?.instrument?.name} 수업,  ${paymentData?.curriculum?.name}를 신청하였습니다`
			});
		}

		const memberRow = await memberService.findUserById(paymentData.member_id!);
		if(memberRow && process.env.NODE_ENV !== 'development') {
			if(memberRow.notification_type == '카카오알림톡') {
				if(memberRow?.cellphone) {
					await aligoService.sendKakao({
						phone: memberRow?.cellphone.replace(/-/g, ""),
						code: 'TK_9343',
						content: `수강신청이 완료되었습니다.

영업일 기준 1~2일 이내로  탬버린뮤직의 전자 계약서가 발송될 예정입니다.

계약서 서명이후 선생님 매칭이 시작되며 선생님 매칭이 완료되면 본 알림톡을 통해 연락드리도록 하겠습니다.

이외에도 궁금한 점이나 건의사항, 요청사항이 있으시면 알림톡을 통해 문의 남겨주시면 최선을 다해 답변드리도록 하겠습니다. 

감사합니다.

탬버린 뮤직 드림`
		
					});
				}
			} else {

				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				if (emailRegex.test(memberRow.user_id)) {
					await emailService.sendEmail({
						email: memberRow.user_id,
						subject:'[탬버린 뮤직] 수강신청이 완료되었습니다.',
						content: `[탬버린 뮤직] <br>
수강신청이 완료되었습니다.<br>
영업일 기준 1~2일 이내로  탬버린뮤직의 전자 계약서가 발송될 예정입니다.<br>
계약서 서명이후 선생님 매칭이 시작되며 선생님 매칭이 완료되면 본 알림톡을 통해 연락드리도록 하겠습니다.<br>
이외에도 궁금한 점이나 건의사항, 요청사항이 있으시면 알림톡을 통해 문의 남겨주시면 최선을 다해 답변드리도록 하겠습니다. <br>
감사합니다.<br>
탬버린 뮤직 드림`
					});
				}

				
			}
		}
		


		// 결제완료 
		response.status(200).send('success');
	}catch(err) {
		console.log(err);
		response.status(400).send('request periodic payment error');
	}
});




// router.use('/list', verifyToken);

// 전체 목록
router.get('/list/all', async (request: Request, response: Response) => {
	const paymentsService = new PaymentsService();

	try {
		const member_id: number = parseInt(request.query.member_id as string);
		const teacher_id: number = parseInt(request.query.teacher_id as string);
		const status: number | undefined = request.query.status !== undefined ? parseInt(request.query.status as string) : undefined;
		let paymentsList;


		if (member_id && status !== undefined) {
      paymentsList = await paymentsService.findByMemberIdAndStatus(member_id, status);

		} else if(member_id) {
			paymentsList = await paymentsService.findByMemberId(member_id);
		}

		else if(teacher_id) {
			paymentsList = await paymentsService.findByTeacherId(teacher_id);
		}
		
		else {
			paymentsList = await paymentsService.findAll2();
		}



		response.status(200).send(paymentsList);
	} catch (err) {
		response.status(400).send('manage payments list error');
	}
});

// 페이지네이션 목록
router.get('/list', async (request: Request, response: Response) => {
	const paymentsService = new PaymentsService();

	try {
		const page: number = parseInt(request.query.page as string);
		const paymentsList: Payments[] = await paymentsService.findWithPagination('', page, 20);
		response.status(200).send(paymentsList);
	} catch (err) {
		response.status(400).send('manage payments list error');
	}
});


// router.use('/get', verifyToken);
router.get('/get', async (request: Request, response: Response) => {
	const paymentsService = new PaymentsService();

	try {
		const id: number = parseInt(request.query.id as string);
		const payments: Payments | undefined = await paymentsService.findById(id);
		response.status(200).send(payments);
	} catch (err) {
		response.status(400).send('manage payments list error');
	}
});

router.use('/experienceLesson', verifyToken);
router.get('/experienceLesson', async (request: Request, response: Response) => {
	const paymentsService = new PaymentsService();

	try {
		const memberId: number = response.locals['id'];
		const result = await paymentsService.findCurriculumNameByMemberId(memberId, '1개월 체험레슨');
		response.status(200).send(result);
	}catch(err) {
		console.log(err);
		response.status(400).send('manage payments experience lesson error');
	}
});

// router.use('/create', verifyToken);
router.post('/create', async (request: Request, response: Response) => {
	const paymentsService = new PaymentsService();
	const curriculumService = new CurriculumService();

	try {

		const payments: Payments = request.body.payments;

		if(payments.curriculum_id) {
			let curriculumRow = await curriculumService.findById(payments.curriculum_id);
			if(curriculumRow) {
				payments.total_classes = curriculumRow.total_classes;
				payments.remaining_classes = curriculumRow.total_classes;
				payments.classes_price = curriculumRow.price;
				payments.periodic_payment = 20;
				payments.payment_method = '';
				payments.created_date = new Date();

				const months = curriculumRow.months > 0 ? curriculumRow.months : 1;
				

				if (payments.instrument_option === 10) {
					payments.instrument_price = curriculumRow.instrument_rental_fee;
				} else if (payments.instrument_option === 20) {
					payments.instrument_price = curriculumRow.instrument_discount? -curriculumRow.instrument_discount : 0;
				} else if (payments.instrument_option === 30) {
					payments.instrument_price = curriculumRow.instrument_price;
				}

				payments.final_price = payments.classes_price + payments.instrument_price;
				payments.monthly_price = Math.floor(payments.final_price / months);
			}
		}
		let result = await paymentsService.createFront(payments);
		if (!result) {
			response.status(400).send('manage create payments data error');
			return;
		}

		response.status(200).send(result);
	} catch (err) {
		response.status(400).send('manage payments update error');
	}
});

// router.use('/update', verifyToken);
router.put('/update', async (request: Request, response: Response) => {
	const paymentsService = new PaymentsService();

	try {
		const payments: Payments = request.body.payments;
		if (typeof payments.payment_date === 'string') {
			payments.payment_date = new Date(payments.payment_date);
		}
		let result = await paymentsService.update(payments.id!, payments);
		if (!result) {
			response.status(400).send('manage not exist payments data');
			return;
		}

		response.status(200).json('success');
	} catch (err) {
		response.status(400).send('manage payments update error');
	}
});

// router.use('/delete', verifyToken);
router.delete('/delete', async (request: Request, response: Response) => {
	const paymentsService = new PaymentsService();

	try {
		
		const deleteId: number = parseInt(request.query.id as string);
		let result = await paymentsService.delete(deleteId);
		if (!result) {
			response.status(400).send('manage not exist payments data');
			return;
		}

		response.status(200).json('success');
	} catch (err) {
		response.status(400).send('manage payments delete error');
	}
});

export default router;