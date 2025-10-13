import { useMemo, useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { isMobile } from 'react-device-detect';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { loadTossPayments, ANONYMOUS, TossPaymentsPayment } from "@tosspayments/tosspayments-sdk";

import useGlobalStore from '@/stores/globalStore';

import { Instrument } from '@/models/instrument';
import { Curriculum } from '@/models/curriculum';
import { Payments } from '@/models/payments';

import MemberService from '@/services/MemberService';
import PaymentsService from '@/services/PaymentsService';

//----------토스테이먼츠-------------
const domesticGeneralClientKey = import.meta.env.VITE_DOMESTIC_GENERAL_TOSS_API_KEY;
const domesticSubscriptionClientKey = import.meta.env.VITE_DOMESTIC_SUBSCRIPTION_TOSS_API_KEY;
const internationalClientKey = import.meta.env.VITE_INTERNATIONAL_TOSS_API_KEY;

const schema = zod.object({
	id: zod.number(),
	delivery_address: zod.string().min(1, { message: "주소를 입력해주세요." }),
	available_time: zod.string().min(1, { message: "수업 가능시간을 입력해주세요." }),
	memo: zod.string(),
	payment_type: zod.number(),
	status: zod.number(),
	payment_date: zod.date(),
	agree: zod.boolean().refine(val => val === true, {
		message: "결제정보 및 유의사항 동의를 체크하셔야 결제하실 수 있습니다."
	}),
});

const cardSchema = zod.object({
	card_number: zod.string().min(1, { message: "카드번호를 입력해주세요." }),
	card_expiration_year: zod.string().min(1, { message: "카드 유효년도를 입력해주세요." }),
	card_expiration_month: zod.string().min(1, { message: "카드 월을 입력해주세요." }),
});

function Payment() {
	const [visible, setVisible] = useState(false);
	const [payForeign, setPayForeign] = useState(false);
	const [isPaymentInProgress, setIsPaymentInProgress] = useState(false);
	const { id } = useParams();
	const searchParams = new URLSearchParams(window.location.search);
	const code = searchParams.get('code');
	const message = searchParams.get('message');
	const navigate = useNavigate();
	const [paymentsRow, setPaymentsRow] = useState<Payments>();
	const [currentDate, setCurrentDate] = useState<Date>(new Date());
	const [availableDate, setAvailableDate] = useState<Date>(new Date());

	const { isAuthenticated, member } = useGlobalStore();

	const defaultValues: Payments = useMemo(() => ({
		id: paymentsRow?.id ?? 0,
		member_id: isAuthenticated ? (member?.id ?? 0) : 0,
		teacher_id: 0,
		instrument_id: paymentsRow?.instrument?.id ?? 0,
		curriculum_id: paymentsRow?.curriculum?.id ?? 0,
		total_classes: 0,
		remaining_classes: 0,
		instrument_option: 30,
		delivery_address: "",
		available_time: "",
		memo: "",
		teacher_memo: "",
		classes_price: 0,
		instrument_price: 0,
		monthly_price: 0,
		final_price: 0,
		payment_type: 10,
		periodic_payment: 10,
		billing_key: "",
		payment_method: "",
		bank_name: "",
		bank_account_number: "",
		bank_account_holder: "",
		status: paymentsRow?.status ?? 0,
		periodic_status: "",
		payment_date: new Date(),
		pg_pay_no: "",
		error_log: "",
		is_deleted: "",
		created_date: new Date()
	}), [isAuthenticated, member, paymentsRow]);

	const defaultCardValues = {
		card_number: "",
		card_expiration_year: "",
		card_expiration_month: "",
	};

	const methods = useForm<Payments>({
		resolver: zodResolver(schema),
		defaultValues,
	});

	const cardMethods = useForm<any>({
		resolver: zodResolver(cardSchema),
		defaultValues: {
			card_number: "",
			card_expiration_year: "",
			card_expiration_month: "",
		},
	});
	//-----------토스페이먼츠------------
	const [paymentDomestic, setPaymentDomestic] = useState<TossPaymentsPayment | null>(null);
	const [paymentInternational, setPaymentInternational] = useState<TossPaymentsPayment | null>(null);
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('CARD'); //카드 결제 기본값.

	function selectPaymentMethod(method) {
		if(payForeign) {
			setPayForeign(false);
		}

		setSelectedPaymentMethod(method);
	}

	useEffect(() => {
		if (message) {
			alert(message);
		}
	}, []);

	useEffect(() => {
		async function fetchPayment() {
			try {
				if(paymentsRow?.payment_type == 5 || paymentsRow?.payment_type == 10) { //국내 결제
					const tossPaymentsDomestic = await loadTossPayments(paymentsRow?.payment_type == 5 ? domesticGeneralClientKey : domesticSubscriptionClientKey);

					// 비회원 결제
					// const payment = tossPayments.payment({ customerKey: ANONYMOUS });

					// 회원 결제
					// @docs https://docs.tosspayments.com/sdk/v2/js#tosspaymentspayment
					const paymentDomestic = tossPaymentsDomestic.payment({
						customerKey: paymentsRow?.id?.toString() ?? "",
					});
					setPaymentDomestic(paymentDomestic);
				} else if(paymentsRow?.payment_type == 20) { //해외 결제
					const tossPaymentsInternational = await loadTossPayments(internationalClientKey);
					const paymentInternational = tossPaymentsInternational.payment({
						customerKey: paymentsRow?.id?.toString() ?? "",
					});
					setPaymentInternational(paymentInternational);
				}
			} catch (error) {
				console.error("Error fetching payment:", error);
			}
		}

		fetchPayment();
	}, [domesticGeneralClientKey,domesticSubscriptionClientKey, internationalClientKey, paymentsRow, selectedPaymentMethod]);

	async function requestPayment() {
		if (isPaymentInProgress) {
			alert("결제가 진행 중입니다. 잠시만 기다려주세요.");
			return;
		}

		setIsPaymentInProgress(true);
		
		try {
			const orderId = `tamburin-${paymentsRow!.id!}`;
			const orderName = `${paymentsRow?.instrument?.name} (${paymentsRow?.curriculum?.name})`;
			const customerEmail = paymentsRow?.member?.user_id ?? "";
			const customerName = paymentsRow?.member?.name ?? "";
			
			const tossPaymentsDomestic = await loadTossPayments(domesticGeneralClientKey);

					// 비회원 결제
					// const payment = tossPayments.payment({ customerKey: ANONYMOUS });

					// 회원 결제
					// @docs https://docs.tosspayments.com/sdk/v2/js#tosspaymentspayment
					const paymentDomestic = tossPaymentsDomestic.payment({
						customerKey: paymentsRow?.id?.toString() ?? "",
					});
					setPaymentDomestic(paymentDomestic);

		//CARD, TRANSFER, VIRTUAL_ACCOUNT, MOBILE_PHONE, CULTURE_GIFT_CERTIFICATE, FOREIGN_EASY_PAY
		const paymentData = {
			method: selectedPaymentMethod,
			amount: {
				value: paymentsRow?.monthly_price,
				currency: "KRW",
			},
			orderId: orderId,
			orderName: orderName,
			successUrl: window.location.origin + "/mypage/payments", // 결제 요청이 성공하면 리다이렉트되는 URL
			failUrl: window.location.origin + `/payment/${id}`, // 결제 요청이 실패하면 리다이렉트되는 URL
			customerEmail: customerEmail,
			customerName: customerName,
			metadata: {
				payment_id: paymentsRow?.id,
				payment_type: paymentsRow?.payment_type,
				payment_method: selectedPaymentMethod,
			},
			// 가상계좌 안내, 퀵계좌이체 휴대폰 번호 자동 완성에 사용되는 값
			// customerMobilePhone: "01012341234",
		};

		if(selectedPaymentMethod == 'CARD') {
			Object.assign(paymentData, {card: {
				useEscrow: false,
				flowMode: "DEFAULT",
				useCardPoint: false,
				useAppCardOnly: false,
			}});
		} else if(selectedPaymentMethod == 'TRANSFER') {
			Object.assign(paymentData, {transfer: {
				useEscrow: false,
			}});
		} else if(selectedPaymentMethod == 'VIRTUAL_ACCOUNT') {
			Object.assign(paymentData, {virtualAccount: {
				useEscrow: false,
				cashReceipt: {
					type: "소득공제",
				  },
			}});
		} else if(selectedPaymentMethod == 'FOREIGN_EASY_PAY') {
			Object.assign(paymentData, {foreignEasyPay: {
				useEscrow: false,
				provider: "PAYPAL",
				country: "KR"
			}});
		}
		await paymentDomestic?.requestPayment(paymentData as any);
		} catch (error) {
			console.error("결제 요청 중 오류 발생:", error);
			alert("결제 요청 중 오류가 발생했습니다. 다시 시도해주세요.");
		} finally {
			setIsPaymentInProgress(false);
		}
	}


	function isValidEmail(email?: string): boolean {
		if (!email) return false;
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}


	
	async function requestBillingAuth(isDomestic: boolean) {
		if (isPaymentInProgress) {
			alert("결제가 진행 중입니다. 잠시만 기다려주세요.");
			return;
		}

		setIsPaymentInProgress(true);
		
		try {
			PaymentsService.paymentLog(`${selectedPaymentMethod} 결제 시작`);
			
			if (selectedPaymentMethod !== 'CARD' && selectedPaymentMethod !== 'FOREIGN_EASY_PAY') {
				//alert("카드 결제만 지원합니다.");
				//return;
			}
			if(isDomestic) {
			await paymentDomestic?.requestBillingAuth({
				method: selectedPaymentMethod as "CARD", // 자동결제(빌링)에 사용할 결제 방식
				successUrl: window.location.origin + "/mypage/payments", // 요청이 성공하면 리다이렉트되는 URL
				failUrl: window.location.origin + `/payment/${id}`, // 요청이 실패하면 리다이렉트되는 URL
				customerEmail: isValidEmail(paymentsRow?.member?.user_id) ? paymentsRow?.member?.user_id! : "",
				customerName: paymentsRow?.member?.name ?? "",
			});
			} else {
			// 해외결제 중복 방지를 위한 추가 체크
			PaymentsService.paymentLog(`해외 카드 결제 시작 - Customer: ${paymentsRow?.id}`);
			
			const cardNumber = cardMethods.getValues('card_number');
			const cardExpirationYear = cardMethods.getValues('card_expiration_year');
			const cardExpirationMonth = cardMethods.getValues('card_expiration_month');
			
			// 카드 정보 유효성 검사
			if (!cardNumber || !cardExpirationYear || !cardExpirationMonth) {
				alert("카드 정보를 모두 입력해주세요.");
				return;
			}
			
			// 결제 처리 상태를 세션에 저장 (중복 방지)
			const paymentSessionKey = `payment_${paymentsRow?.id}_${Date.now()}`;
			sessionStorage.setItem(paymentSessionKey, JSON.stringify({
				customerId: paymentsRow?.id,
				timestamp: Date.now(),
				paymentType: 'international'
			}));
			
			const redirectUrl = `${window.location.origin}/mypage/payments?paymentSession=${paymentSessionKey}&customerKey=${paymentsRow?.id}&cardNumber=${cardNumber}&cardExpirationYear=${cardExpirationYear}&cardExpirationMonth=${cardExpirationMonth}`;
			window.location.href = redirectUrl;
			/*
			await paymentInternational?.requestBillingAuth({
				method: selectedPaymentMethod as "CARD" | "TRANSFER", // 자동결제(빌링)에 사용할 결제 방식
				successUrl: window.location.origin + "/mypage/payments", // 요청이 성공하면 리다이렉트되는 URL
				failUrl: window.location.origin + `/payment/${id}`, // 요청이 실패하면 리다이렉트되는 URL
				customerEmail: isValidEmail(paymentsRow?.member?.user_id) ? paymentsRow?.member?.user_id! : "",
				customerName: paymentsRow?.member?.name ?? "",
			});
			*/
		}
		} catch (error) {
			console.error("빌링 인증 요청 중 오류 발생:", error);
			alert("결제 요청 중 오류가 발생했습니다. 다시 시도해주세요.");
		} finally {
			setIsPaymentInProgress(false);
		}
	}

	async function loadInitialData() {
		setPaymentsRow(await PaymentsService.get(Number(id)));
		if (paymentsRow?.curriculum?.months) {
			setCurrentDate(new Date());
			const months = new Date();
			months.setMonth(months.getMonth() + paymentsRow.curriculum.months);
			setAvailableDate(months);
		}

		setVisible(true);
	}

	useEffect(() => {
		loadInitialData();
	}, []);


	useEffect(() => {
		methods.reset(defaultValues);
		cardMethods.reset(defaultCardValues);
	}, [paymentsRow]);


	// console.log(methods.formState.errors);

	const formatDate = (date) => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}.${month}.${day}`;
	};


	const onError = (errors) => {
		if (errors.agree) {
			alert(errors.agree.message);
		}
	};


	const onSubmit = async (data: Payments) => {
		if (isPaymentInProgress) {
			alert("결제가 진행 중입니다. 잠시만 기다려주세요.");
			return;
		}

		try {
			const { agree, ...payload } = data as any;
			const result = await PaymentsService.update(payload);

			//결제 창 띄우기.
			if (data.payment_type == 5) { //일반 결제
				await requestPayment();
			} else if (data.payment_type == 10) { //국내 정기결제
				await requestBillingAuth(true);
			} else if (data.payment_type == 20) { //해외 정기결제
				await requestBillingAuth(false);
			}

			return;
			if (result) {
				alert("수강신청이 완료 되었습니다.");
				navigate('/mypage/payments');
			} else {
				alert("수강신청이 실패했습니다.");
			}
		} catch (error) {
			console.error(error);
			alert("오류가 발생했습니다. 다시 시도해주세요.");
		}
	};

	function domesticPayment() {
		if(selectedPaymentMethod != 'CARD') {
			methods.setValue('payment_type', 5); //일반 결제.
		}else{
			methods.setValue('payment_type', 10); //자동 결제.
		}
	}

	function foreignPayment() {
		if(selectedPaymentMethod != 'CARD') {
			alert("해외 결제는 카드 결제만 가능합니다.");
			return;
		}

		setPayForeign(true);
	}


	return (
		<div className={`vh-content-wrap ${visible && 'active'}`}>
			<FormProvider {...methods}>
				<form onSubmit={methods.handleSubmit(onSubmit, onError)}>
					<input type="hidden" {...methods.register('payment_type')} />
					<div className="payment">
						<div className="vw-inner">

							<h1 className="title"><strong>신청</strong> 정보</h1>
							<div className="classes-info">
								<strong>[클래스]</strong> {paymentsRow?.instrument?.name} <br />
								<strong>[수강 기간]</strong> {paymentsRow?.curriculum?.name} ({paymentsRow?.curriculum?.months}개월, 총 {paymentsRow?.curriculum?.total_classes}회) <br />
								<strong>[악기 선택]</strong> {paymentsRow?.instrument_option == 10 ? '악기 대여' : paymentsRow?.instrument_option == 20 ? '개인 악기' : '악기 구매'}
							</div>


							<h1 className="title"><strong>수업</strong> 가능시간</h1>
							<div className="classes-time">
								<h1>수업 가능시간 입력</h1>
								<textarea {...methods.register('available_time')} rows={5} placeholder='ex) 매주 [월]요일 [00:00]시 부터 [00:00]시까지'></textarea>
							</div>
							<p className="msg">* 수업 가능시간을 <strong>[최대한 많이]</strong> 입력해주실수록 더욱 빠르게 선생님이 매칭됩니다.</p>


							<h1 className="title"><strong>악기</strong> 배송 정보</h1>
							<div className="form-group">
								<input type="text" {...methods.register('delivery_address')} placeholder='주소' />
								<p className="msg">*해외 거주자는 거주하고 계신 해외 주소를 입력해주세요.</p>
								<input type="text" {...methods.register('memo')} placeholder='참고 항목' />
							</div>
							{/* <div className="form-group">
						<div className="field-row">
							<input type="text" readOnly placeholder='우편번호' />
							<button type="button" className="btn-sm color-blue">주소 검색</button>
						</div>
						<p className="msg">*[주소검색] 팝업창이 뜨지 않는 경우 인터넷 설정에서 [팝업 차단]을 해제하고 시도해주세요.</p>
						<input type="text" readOnly placeholder='주소' />
						<input type="text" placeholder='상세 주소' />
						<p className="msg">*주소를 입력해주세요.</p>
						<input type="text" placeholder='참고 항목' />
					</div> */}


							<h1 className="title"><strong>결제</strong> 금액</h1>
							<ul className="payment-info">
								<li>
									<h1>이용기간</h1>
									<p> {formatDate(currentDate)} ~ {formatDate(availableDate)}</p>
								</li>
								<li>
									<h1>수업금액</h1>
									<p>{paymentsRow?.classes_price.toLocaleString()} 원</p>
								</li>
								<li>
									<h1>악기금액</h1>
									<p>	{paymentsRow?.instrument_price.toLocaleString()} 원</p>
								</li>
								<li>
									<h1>월 자동 결제금액</h1>
									<p className="month-price">{paymentsRow?.monthly_price.toLocaleString()} 원 ({paymentsRow?.curriculum?.months}개월)</p>
								</li>
							</ul>


							<h1 className="title"><strong>결제</strong> 방법</h1>
							<div className="checkbox check-type-01">
								<input type="radio" checked={selectedPaymentMethod == 'CARD'} onChange={() => selectPaymentMethod('CARD')} />
								<label>
									<span>신용카드</span>
								</label>
							</div>
							{paymentsRow?.curriculum?.months === 1 && (
								<>
									<div className="checkbox check-type-01">
										<input type="radio" checked={selectedPaymentMethod == 'TRANSFER'} onChange={() => selectPaymentMethod('TRANSFER')} />
										<label>
											<span>실시간 계좌이체</span>
										</label>
									</div>
									<div className="checkbox check-type-01">
										<input type="radio" checked={selectedPaymentMethod == 'VIRTUAL_ACCOUNT'} onChange={() => selectPaymentMethod('VIRTUAL_ACCOUNT')}	/>
										<label>
											<span>가상계좌</span>
										</label>
									</div>
								</>
							)}

							<div className="devide"></div>

							<div className="notice">
								<strong>유의사항</strong> <br />
								<em>모든 과외 수업은 <strong>오프라인 방문 없이 온라인</strong>으로 진행됩니다.</em>
								<em>주 2회의 경우 월 8회, 주 1회의 경우 월 4회 과외 진행됩니다.</em>
								<em>월 자동결제는 1개월 단위로 자동결제가 이루어지며, 구매하신 날과 매월 동일한 날짜에 결제가 이루어 집니다.<br />
									다만, 해당 일자가 없는 경우 해당 월의 말일에 결제가 이루어집니다.</em>
								<em>과외 중단 시, 10일 내에 처음 발송된 악기 구성품 그대로 반납해주셔야 합니다. (악기/케이스/소모품 등)<br />
									단, 1,3,6개월 등록 회원이 12개월 이상 수강 시엔 반납 하지 않음</em>
							</div>


							<div>
								<div className="form-check">
									<input className="form-check-input" id="agree" type="checkbox"{...methods.register('agree' as any)} />
									<label className="form-check-label chk" htmlFor="agree">
									위 수업, 결제 정보와 유의사항을 모두 확인하였습니다.
									</label>
								</div>
							</div>

							{ payForeign ? (
								<>
									<FormProvider {...cardMethods}>
										<h1 className="title"><strong>해외</strong> 카드정보</h1>
										<div className="form-group">
											<input type="text" {...cardMethods.register('card_number')} placeholder='카드번호' />
											<p className="msg">* 하이픈(-)을 제외한 카드번호를 입력해주세요. <br />* AMEX, Diners, Discover, JCB, Master, Visa 카드사 이용이 가능합니다.</p>
											<input type="text" {...cardMethods.register('card_expiration_year')} placeholder='카드 유효년도 (ex - 32/두자리)' />
											<p className="msg">* 카드 유효 년도를 두자리 숫자만 입력해주세요.</p>
											<input type="text" {...cardMethods.register('card_expiration_month')} placeholder='카드 월 (ex - 05/두자리)' />
											<p className="msg">* 카드 유효 월을 두자리 숫자만 입력해주세요.</p>
										</div>
										<div className="btn_area">
											<button 
												type="button" 
												onClick={() => setPayForeign(false)} 
												style={{ background:'#8f8f8f'}}
												disabled={isPaymentInProgress}
											>
												취소
											</button>
											<button 
												type="submit" 
												onClick={() => methods.setValue('payment_type', 20)}
												disabled={isPaymentInProgress}
												style={{ opacity: isPaymentInProgress ? 0.5 : 1, cursor: isPaymentInProgress ? 'not-allowed' : 'pointer' }}
											>
												{isPaymentInProgress ? '결제 진행 중...' : '결제하기'}
											</button>
										</div>
									</FormProvider>
								</>
							) : (
								<div className="btn_area">
									<button 
										type="submit" 
										onClick={() => domesticPayment()} 
										disabled={isPaymentInProgress}
										style={{ opacity: isPaymentInProgress ? 0.5 : 1, cursor: isPaymentInProgress ? 'not-allowed' : 'pointer' }}
									>
										{isPaymentInProgress ? '결제 진행 중...' : '국내결제'}
									</button>
									{selectedPaymentMethod !== 'VIRTUAL_ACCOUNT' && selectedPaymentMethod !== 'TRANSFER' && (
										<button 
											type="button" 
											onClick={() => foreignPayment()}
											disabled={isPaymentInProgress}
											style={{ opacity: isPaymentInProgress ? 0.5 : 1, cursor: isPaymentInProgress ? 'not-allowed' : 'pointer' }}
										>
											해외결제
										</button>
									)}
								</div>
							)}

						</div>
					</div>
				</form>
			</FormProvider>
		</div>
	);
}

function generateRandomString() {
	return window.btoa(Math.random().toString()).slice(0, 20);
}

export default Payment;
