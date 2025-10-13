import { useState, useEffect } from 'react';
import { Payments } from '@/models/payments'
import PaymentsService from '@/services/PaymentsService';
import useGlobalStore from '@/stores/globalStore';


function PaymentHistory() {
	const [visible, setVisible] = useState(false);
	const [paymentsList, setPaymentsList] = useState<Payments[]>([]);
	const [isPaymentProcessed, setIsPaymentProcessed] = useState(false); // 결제 처리 완료 상태
	const searchParams = new URLSearchParams(window.location.search);
	const customerKey = searchParams.get('customerKey'); //정기 결제 (국내)
	const authKey = searchParams.get('authKey'); //정기 결제 (국내)
	const cardNumber = searchParams.get('cardNumber'); //정기 결제 (해외)
	const cardExpirationYear = searchParams.get('cardExpirationYear'); //정기 결제 (해외)
	const cardExpirationMonth = searchParams.get('cardExpirationMonth'); //정기 결제 (해외)
	const paymentSession = searchParams.get('paymentSession'); //결제 세션 키 (중복 방지)
	const orderId = searchParams.get('orderId'); //일반 결제
	const paymentKey = searchParams.get('paymentKey'); //일반 결제
	const amount = searchParams.get('amount'); //일반 결제
	const { member } = useGlobalStore();

	const [visibleVirtualAccount, setVisibleVirtualAccount] = useState<number | null>(null);

	 // 가상계좌 토글 함수
	const toggleVirtualAccount = (paymentId: number) => {
		setVisibleVirtualAccount(visibleVirtualAccount === paymentId ? null : paymentId);
	};

	async function loadInitialData() {
		setPaymentsList(await PaymentsService.getByMemberId(Number(member?.id)));

		setVisible(true);
	}

	async function checkPaymentStatus() {
		setInterval(() => {
			loadInitialData();
		}, 2000);
	}

	useEffect(() => {
		// 이미 결제 처리가 완료된 경우 재처리 방지
		if (isPaymentProcessed) {
			loadInitialData();
			return;
		}

		// 결제 완료 후 처리 로직
		const processPayment = async () => {
			try {
				// 해외결제 중복 처리 방지 검사
				if (paymentSession && customerKey && cardNumber && cardExpirationYear && cardExpirationMonth) {
					const sessionData = sessionStorage.getItem(paymentSession);
					if (!sessionData) {
						console.warn("유효하지 않은 결제 세션입니다.");
						window.history.replaceState({}, '', `/mypage/payments`);
						return;
					}
					
					const session = JSON.parse(sessionData);
					if (session.customerId !== customerKey) {
						console.warn("결제 세션과 고객 정보가 일치하지 않습니다.");
						window.history.replaceState({}, '', `/mypage/payments`);
						return;  
					}
					
					// 세션 삭제 (중복 방지)
					sessionStorage.removeItem(paymentSession);
				}

				if((customerKey && authKey) || (customerKey && cardNumber && cardExpirationYear && cardExpirationMonth)) { 
					// 정기 결제 완료된 경우 - 빌링키 요청
					if(customerKey && authKey) {
						await PaymentsService.requestPeriodicPayment(customerKey, authKey);
					} else if(customerKey && cardNumber && cardExpirationYear && cardExpirationMonth) {
						await PaymentsService.requestPeriodicPaymentForInternational(customerKey, cardNumber, cardExpirationYear, cardExpirationMonth);
					}
					
					// 결제 처리 완료 표시 및 URL 정리
					setIsPaymentProcessed(true);
					window.history.replaceState({}, '', `/mypage/payments`);
					
					// 결제 완료한 상태의 결제 내역에서는 타이머 작동
					checkPaymentStatus();	
				} else if(paymentKey && paymentKey !== "") { 
					// 일반 결제 완료된 경우 - 결제 승인 요청
					await PaymentsService.requestPayment(orderId ?? "", paymentKey, parseInt(amount ?? "0"));
					
					// 결제 처리 완료 표시 및 URL 정리
					setIsPaymentProcessed(true);
					window.history.replaceState({}, '', `/mypage/payments`);
					
					// 결제 완료한 상태의 결제 내역에서는 타이머 작동
					checkPaymentStatus();
				}
			} catch (error) {
				console.error("결제 처리 중 오류 발생:", error);
			}
		};

		if (member) {
			processPayment();
		}

		loadInitialData();
	}, [member]);


	const handleDelete = async (id: number) => {
		if (id) {
			try {
				const result = await PaymentsService.delete(id);
				if(result) {
					loadInitialData();
				} else {
					alert("삭제에 실패했습니다.");
				}
			} catch (error) {
				console.error(error);
				alert('삭제에 실패했습니다.');
			}

		}
	};


	return (
		<div className={`vh-content-wrap ${visible && 'active'}`}>
			<div className="board-list mypage-payment">
				<div className="vw-inner">
					<h1>결제내역</h1>
					<table>
						<thead>
							<tr>
								<th className="pc_only">No.	</th>
								<th>수업명</th>
								<th className="pc_only">수업구성</th>
								<th className="pc_only">악기옵션</th>
								<th className="pc_only">수업금액</th>
								<th className="pc_only">악기금액</th>
								<th className="pc_only">월결제금액</th>
								<th>결제금액</th>
								<th className="pc_only">결제방법</th>
								<th>상태</th>
								<th>비고</th>
								<th>로그</th>
								<th>결제날짜</th>
							</tr>
						</thead>
						<tbody>
							{
								paymentsList.map((row, index) => (
									<>
									<tr key={index}>
										<td className="pc_only">{index + 1}</td>
										<td>{row?.instrument?.name}</td>
										<td className="pc_only">{row?.curriculum?.name}</td>
										<td className="pc_only">{row?.instrument_option === 10 ? '악기대여' : row?.instrument_option === 20 ? '개인악기' : '악기구매'}</td>
										<td className="pc_only">{row?.classes_price?.toLocaleString()} 원</td>
										<td className="pc_only">{row?.instrument_price?.toLocaleString()} 원</td>
										<td className="pc_only text-red">{row?.monthly_price?.toLocaleString()} 원</td>
										<td className="text-red">{row?.final_price?.toLocaleString()} 원</td>
										<td>
											{row.payment_method == 'card' ? '신용카드' : 
											row.payment_method == 'transfer' ? '실시간 계좌이체' : 
											row.payment_method == 'virtual_account' ? <button type="button" className="btn-sm color-blue" onClick={() => toggleVirtualAccount(row.id ?? 0)}>가상계좌</button> : 
											row.payment_method == '' ? '' : '무통장입금'}
										</td>
										<td>{row.status == 10 ? '결제대기' : row.status == 20 ? '결제완료' : row.status == 30 ? '환불요청' : '환불완료'}</td>
										<td>{row.status === 10 && <button type="button" onClick={() => handleDelete(row?.id ?? 0)}>삭제</button>}</td>
										<td className="pc_only">{row?.error_log}</td>
										<td>{row.payment_date && new Date(row.payment_date).toISOString().split('T')[0]}</td>
									</tr>
									{visibleVirtualAccount=== row.id && row.payment_method === 'virtual_account' && (
										<tr>
											<td colSpan={13}>
												<div className="virtual-account-info">
													<h4>가상계좌 정보</h4>
													<div className="account-details">
													<div className="account-item">
														<span className="label">은행명 : </span>
														<span className="value">{
															row.bank_name === '39' ? '경남은행' :
															row.bank_name === '34' ? '광주은행' :
															row.bank_name === '12' ? '단위농협(지역농축협)' :
															row.bank_name === '32' ? '부산은행' :
															row.bank_name === '45' ? '새마을금고' :
															row.bank_name === '64' ? '산림조합' :
															row.bank_name === '88' ? '신한은행' :
															row.bank_name === '48' ? '신협' :
															row.bank_name === '27' ? '씨티은행' :
															row.bank_name === '20' ? '우리은행' :
															row.bank_name === '71' ? '우체국예금보험' :
															row.bank_name === '50' ? '저축은행중앙회' :
															row.bank_name === '37' ? '전북은행' :
															row.bank_name === '35' ? '제주은행' :
															row.bank_name === '90' ? '카카오뱅크' :
															row.bank_name === '89' ? '케이뱅크' :
															row.bank_name === '92' ? '토스뱅크' :
															row.bank_name === '81' ? '하나은행' :
															row.bank_name === '54' ? '홍콩상하이은행' :
															row.bank_name === '03' ? 'IBK기업은행' :
															row.bank_name === '06' ? 'KB국민은행' :
															row.bank_name === '31' ? 'iM뱅크(대구)' :
															row.bank_name === '02' ? '한국산업은행' :
															row.bank_name === '11' ? 'NH농협은행' :
															row.bank_name === '23' ? 'SC제일은행' :
															row.bank_name === '07' ? 'Sh수협은행' :
															row.bank_name === 'S8' ? '교보증권' :
															row.bank_name === 'SE' ? '대신증권' :
															row.bank_name === 'SK' ? '메리츠증권' :
															row.bank_name === 'S5' ? '미래에셋증권' :
															row.bank_name === 'SM' ? '부국증권' :
															row.bank_name === 'S3' ? '삼성증권' :
															row.bank_name === 'SN' ? '신영증권' :
															row.bank_name === 'S2' ? '신한금융투자' :
															row.bank_name === 'S0' ? '유안타증권' :
															row.bank_name === 'SJ' ? '유진투자증권' :
															row.bank_name === 'SQ' ? '카카오페이증권' :
															row.bank_name === 'SB' ? '키움증권' :
															row.bank_name === 'ST' ? '토스증권' :
															row.bank_name === 'SR' ? '펀드온라인코리아(한국포스증권)' :
															row.bank_name === 'SH' ? '하나금융투자' :
															row.bank_name === 'S9' ? '아이엠증권' :
															row.bank_name === 'S6' ? '한국투자증권' :
															row.bank_name === 'SG' ? '한화투자증권' :
															row.bank_name === 'SA' ? '현대차증권' :
															row.bank_name === 'SI' ? 'DB금융투자' :
															row.bank_name === 'S4' ? 'KB증권' :
															row.bank_name === 'SP' ? 'KTB투자증권(다올투자증권)' :
															row.bank_name === 'SO' ? 'LIG투자증권' :
															row.bank_name === 'SL' ? 'NH투자증권' :
															row.bank_name === 'SD' ? 'SK증권' :
															row.bank_name || '-'
														}</span>
													</div>
													<div className="account-item">
														<span className="label">계좌번호 : </span>
														<span className="value">{row.bank_account_number || '-'}</span>
													</div>
													<div className="account-item">
														<span className="label">예금주 : </span>
														<span className="value">{row.bank_account_holder || '-'}</span>
													</div>
													</div>
												</div>
											</td>
										</tr>
									)}
									</>
									
								))
							}
							
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

export default PaymentHistory;
