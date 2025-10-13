import schedule from 'node-schedule';
import dayjs from 'dayjs';
import config from './config';
import Logger from './loaders/logger';
import { ClassesService } from './services/classes-service';
import { PaymentsService } from './services/payments-service';
import { PeriodicPaymentsService } from './services/periodicPayments-service';
import { TossPaymentsService } from './services/toss-payments-service';
import { MemberService } from './services/member-service';
import { AligoService } from './services/aligo-service';
import { EmailService } from './services/email-service';

export class Scheduler {
	public async start() {
		if (config.serverNumber == "1") { //첫번째 서버만 동작.
			schedule.scheduleJob({ rule: '*/1 * * * *', tz: 'Asia/Seoul' }, async () => {
				/**
				 * 정기결제 실행
				 */
				if (process.env.NODE_ENV !== 'development') {
					//정기 결제 DB에서 현재 날짜에 대한 결제 반영.
					try {
						const today = new Date();
						const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
						const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

						const aligoService = new AligoService();
						const emailService = new EmailService();
						const paymentsService = new PaymentsService();
						const periodicPaymentsService = new PeriodicPaymentsService();
						const tossPaymentsService = new TossPaymentsService();
						const memberService = new MemberService();
						//정기 결제 데이터 조회.
						const periodicPayments = await periodicPaymentsService.findByDate(startOfDay, endOfDay);

						for (let i = 0; i < periodicPayments.length; i++) {
							const periodicPayment = periodicPayments[i];

							if (periodicPayment.status == 10) { //결제 전.
								const payments = await paymentsService.findById(periodicPayment.payments_id);
								if (!payments) {
									continue;
								}

								const member = await memberService.findUserById(payments.member_id!);
								if (!member) {
									continue;
								}

								// 고유한 orderId 생성 (날짜 기반으로 중복 방지)
								const orderId = `${payments.id!.toString()}-${dayjs().format('YYYYMMDD')}`;
								
								// 토스페이먼츠에서 이미 처리된 결제인지 확인
								const existingPayment = await tossPaymentsService.getPaymentByOrderId(orderId, payments.payment_type === 10 ? 'domestic_subscription' : 'international');
								if (existingPayment && existingPayment.status === 'DONE') {
									// 이미 토스에서 결제 완료된 경우, DB 상태만 동기화
									await periodicPaymentsService.update(periodicPayment.id!, { status: 20 });
									continue;
								}

								// 결제 진행 중 상태로 즉시 변경 (중복 실행 방지)
								await periodicPaymentsService.update(periodicPayment.id!, { status: 15 }); // 15: 결제 진행 중

								//결제 요청.
								const approveAutoPayment = await tossPaymentsService.approveAutoPayment(
									payments.billing_key,
									payments.id!.toString(),
									payments.monthly_price,
									orderId, // 고유한 orderId 사용
									'',
									member.name,
									member.user_id.indexOf('@') > -1 ? member.user_id : '', //member.user_id
									payments.payment_type === 10 ? 'domestic_subscription' : 'international'
								);

								if (approveAutoPayment) {
									// 결제 성공 후 토스 서버에서 다시 한번 확인
									const verifiedPayment = await tossPaymentsService.getPayment(approveAutoPayment.paymentKey, payments.payment_type === 10 ? 'domestic_subscription' : 'international');
									
									if (verifiedPayment && verifiedPayment.status === 'DONE') {
										//결제 완료로 변경.
										await periodicPaymentsService.update(periodicPayment.id!, { status: 20 });
									} else {
										// 토스 서버 확인 결과 불일치 시 실패 처리
										await periodicPaymentsService.update(periodicPayment.id!, { status: 30 });
										await paymentsService.update(periodicPayment.payments_id!, { periodic_status: '결제 검증 실패' });
									}
								} else {
									await periodicPaymentsService.update(periodicPayment.id!, { status: 30 });
									await paymentsService.update(periodicPayment.payments_id!, { periodic_status: '결제 실패' });

									// 결제 실패 시 관리자에게 알림톡 발송
									await aligoService.sendKakao({
										phone: '01051321404',
										code: 'TZ_3092',
										content: `정기결제가 실패 하였습니다.
		결제번호 : ${periodicPayment.payments_id}`
									});
								}
							}
						}
					} catch (err) {
						console.log(err);
					}

				}
			});

			// 수업 5분 전 줌링크 발송 (매분 체크 필요)
			schedule.scheduleJob({ rule: '*/1 * * * *', tz: 'Asia/Seoul' }, async () => {
				if (process.env.NODE_ENV !== 'development') {
					/**
					 * 수업시간 5분전 학생에게 줌링크 발송
					 */
					try {
						const aligoService = new AligoService();
						const emailService = new EmailService();
						const classesService = new ClassesService();
						const classes = await classesService.findBy5M();

						if (classes && classes.length > 0) {
							for (const row of classes) {
								if (row?.member?.notification_type) {
									if (row?.member?.notification_type === '카카오알림톡') {
										if (row?.member?.cellphone) {
											// 학생 알림톡
											await aligoService.sendKakao({
												phone: row?.member?.cellphone.replace(/-/g, ""),
												code: 'TK_5269',
												content: `${row?.instrument?.name} 선생님 수업 줌링크 : ${row?.payments?.classes_link}`
											});
										}

									} else {
										if (row?.member?.user_id) {
											const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
											if (emailRegex.test(row?.member?.user_id)) {
												await emailService.sendEmail({
													email: row?.member?.user_id,
													subject: '[탬버린 뮤직] 수업링크가 전송되었습니다.',
													content: `${row?.instrument?.name} 선생님 수업 줌링크 : ${row?.payments?.classes_link}`
												});
											}
										}
									}
								}
							}
						}
					} catch (err) {
						console.log(err);
					}

				}
			});


			// 매일 오전 8시에 실행
			schedule.scheduleJob({ rule: '0 8 * * *', tz: 'Asia/Seoul' }, async () => {
				if (process.env.NODE_ENV !== 'development') {
					/**
					 * 오늘 수업여부 발송
					 */
					try {
						const aligoService = new AligoService();
						const emailService = new EmailService();
						const classesService = new ClassesService();
						const classes = await classesService.findByToday();

						if (classes && classes.length > 0) {
							for (const row of classes) {

								// 강사에게 알림톡 발송
								if (row?.teacher?.cellphone) {
									await aligoService.sendKakao({
										phone: row?.teacher?.cellphone.replace(/-/g, ""),
										code: 'TH_8113',
										content: `${dayjs.utc(row?.classes_date).tz('asia/seoul').format("YYYY년 M월 D일 H시 mm분")} ${row?.instrument?.name} 수업이 있습니다.`
									});
								}

								if (row?.member?.notification_type) {
									if (row?.member?.notification_type === '카카오알림톡') {
										if (row?.member?.cellphone) {
											// 학생 알림톡
											await aligoService.sendKakao({
												phone: row?.member?.cellphone.replace(/-/g, ""),
												code: 'TH_8113',
												content: `${dayjs.utc(row?.classes_date).tz('asia/seoul').format("YYYY년 M월 D일 H시 mm분")} ${row?.instrument?.name} 수업이 있습니다.`
											});
										}

									} else {
										if (row?.member?.user_id) {
											const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
											if (emailRegex.test(row?.member?.user_id)) {
												await emailService.sendEmail({
													email: row?.member?.user_id,
													subject: `[탬버린 뮤직] ${dayjs.utc(row?.classes_date).tz('asia/seoul').format("YYYY년 M월 D일 H시 mm분")} ${row?.instrument?.name} 수업이 있습니다.`,
													content: `${dayjs.utc(row?.classes_date).tz('asia/seoul').format("YYYY년 M월 D일 H시 mm분")} ${row?.instrument?.name} 수업이 있습니다.`
												});
											}
										}
									}
								}
							}
						}


						/**
						 * 오늘 종료 되는 수업찾아서 종료 알림 보내기
						 */
						const EndClasses = await classesService.findByEnd();
						if (EndClasses && EndClasses.length > 0) {
							for (const row of EndClasses) {

								if (row?.member?.notification_type) {
									if (row?.member?.notification_type === '카카오알림톡') {
										if (row?.member?.cellphone) {
											await aligoService.sendKakao({
												phone: row?.member?.cellphone.replace(/-/g, ""),
												code: 'UA_7271',
												content: `안녕하세요 탬버린뮤직입니다.
계약하신 레슨이 모두 종료되어 안내드립니다.

수업에 관하여 건의하실 내용 말씀주시면 최대한 반영하도록 하겠습니다.

마지막으로 계속해서 수강을 원하시는 고객님께서는 꾸준한 레슨을 위해 다음 수업 전에 수강신청을 해주시면 감사하겠습니다.`
											});
										}

									} else {
										if (row?.member?.user_id) {
											const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
											if (emailRegex.test(row?.member?.user_id)) {
												await emailService.sendEmail({
													email: row?.member?.user_id,
													subject: `[탬버린 뮤직] 계약하신 레슨이 모두 종료되어 안내드립니다.`,
													content: `안녕하세요 탬버린뮤직입니다.
계약하신 레슨이 모두 종료되어 안내드립니다.

수업에 관하여 건의하실 내용 말씀주시면 최대한 반영하도록 하겠습니다.

마지막으로 계속해서 수강을 원하시는 고객님께서는 꾸준한 레슨을 위해 다음 수업 전에 수강신청을 해주시면 감사하겠습니다.`
												});
											}
										}
									}
								}
							}
						}


					} catch (err) {
						console.log(err);
					}
				}
			});



			schedule.scheduleJob("*/30 * * * *", async () => { //30분에 한번.
				if (process.env.NODE_ENV !== 'development') {

				}
			});
		}
	}
}