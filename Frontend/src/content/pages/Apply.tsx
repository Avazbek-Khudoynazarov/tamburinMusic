import { useMemo, useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { isMobile } from 'react-device-detect';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';

import useGlobalStore from '@/stores/globalStore';

import { Instrument } from '@/models/instrument';
import { Curriculum } from '@/models/curriculum';
import { Payments } from '@/models/payments';

import InstrumentService from '@/services/InstrumentService';
import CurriculumService from '@/services/CurriculumService';
import PaymentsService from '@/services/PaymentsService';

const schema = zod.object({
	member_id: zod.number(),
	teacher_id: zod.number(),
	instrument_id: zod.number(),
	curriculum_id: zod.number(),
	instrument_option: zod.number(),
	created_date: zod.date(),
});


function Apply() {
	const [visible, setVisible] = useState(false);
	const [instrumentList, setInstrumentList] = useState<Instrument[]>([]);
	const [curriculumList, setcurriculumList] = useState<Curriculum[]>([]);
	const navigate = useNavigate();
	const [message, setMessage] = useState("");
	const [selectedCurriculum, setSelectedCurriculum] = useState<Curriculum>();

	// 탭 open index
	const [openIndexes, setOpenIndexes] = useState<number[]>([]);

	const { isAuthenticated, member } = useGlobalStore();

	const defaultValues: Payments = useMemo(() => ({
		id: 0,
		member_id: isAuthenticated ? (member?.id ?? 0) : 0,
		teacher_id: 0,
		instrument_id: 19,
		curriculum_id: 0,
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
		status: 10,
		periodic_status: "",
		payment_date: null,
		pg_pay_no: "",
		error_log: "",
		is_deleted: "",
		created_date: new Date()
	}), [isAuthenticated, member]);


	const methods = useForm<Payments>({
		resolver: zodResolver(schema),
		defaultValues,
	});

	const selectedInstrumentId = methods.watch('instrument_id');


	async function loadCurriculumData() {
		const list = await CurriculumService.getMonthsByInstrumentId(selectedInstrumentId);

		if (list.length > 0) {
			for (const row of list) {
				row.list = await CurriculumService.getMonthsByInstrumentIdMonths(selectedInstrumentId, row.months);
				if (row.list.length > 0) {
					for (const child of row.list) {
						if (child.additional_text) {
							const tt = child.additional_text.replace(/\n/gi, "\\r\\n");
							child.text = JSON.parse(tt);
						}
					}
				}
			}
		}

		// 1개월 체험레슨용 데이터 따로 가져오기
		const month0 = await CurriculumService.getMonthsBy1month(selectedInstrumentId);

		if (month0.length > 0) {
			for (const child of month0) {
				if (child.additional_text) {
					const tt = child.additional_text.replace(/\n/gi, "\\r\\n");
					child.text = JSON.parse(tt);
				}
			}

			// months: 0인 항목 추가
			list.push({
				months: 0,
				image_file: month0[0]?.image_file ?? '',
				id: month0[0]?.id ?? 0,
				list: month0,
			});
		}
		// console.log(list);
		setcurriculumList(list);
	}


	async function loadInitialData() {
		setInstrumentList(await InstrumentService.getAllList());
		loadCurriculumData();
		setVisible(true);
	}


	useEffect(() => {
		loadInitialData();
	}, []);

	useEffect(() => {
		loadCurriculumData();
	}, [selectedInstrumentId]);





	const smoothScrollTo = (targetY, duration = 800) => {
		const startY = window.pageYOffset;
		const diff = targetY - startY;
		let startTime = null;
		const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
		const step = (currentTime) => {
			if (!startTime) startTime = currentTime;
			const elapsed = currentTime - startTime!;
			const progress = Math.min(elapsed / duration, 1);
			const easedProgress = easeInOutQuad(progress);
			window.scrollTo(0, startY + diff * easedProgress);
			if (elapsed < duration) {
				requestAnimationFrame(step);
			}
		};
		requestAnimationFrame(step);
	};




	const toggleFAQ = (index: number) => {
		setOpenIndexes(prev =>
			prev.includes(index)
				? prev.filter(i => i !== index)
				: [...prev, index]
		);
	};


const instrumentOption = methods.watch('instrument_option');


	const onSubmit = async (data: Payments) => {
		try {
			const { id, ...payload } = data;

			// 1개월 체험레슨 신청일 경우 이미 수강한 이력이 있는지 체크.
			if(selectedCurriculum?.name == '1개월 체험레슨') {
				const result = await PaymentsService.getExperienceLesson();
				if(result == false) {
					alert('1개월 체험레슨은 수업을 진행한 내역이 없는 회원만 신청 가능합니다.');
					return;
				}
			}

			const result = await PaymentsService.create(payload);


			

	// if(selectedInstrumentId == 24 && instrumentOption == 30) {
	// 	alert('바이올린은 악기 보유자만 신청 가능합니다');
	// 	return false;
	// }


			if (result) {
				// alert("결제 정보가 등록되었습니다.");
				navigate(`/payment/${result.insertId}`);
			} else {
				alert("수강신청이 실패했습니다.");
			}
		} catch (error) {
			console.error(error);
			alert("오류가 발생했습니다. 다시 시도해주세요.");
		}
	};


	
	const { monthlyFee, optionPrice, optionText, totalPrice } = useMemo(() => {
		if (!selectedCurriculum) {
			return { monthlyFee: 0, optionPrice: 0, optionText: '' };
		}
		const months = selectedCurriculum.months > 0 ? selectedCurriculum.months : 1;
		const monthlyFee = Math.floor(selectedCurriculum.price / months);

		let optionPrice = 0;
		let optionText = '';

		if (selectedCurriculum.months > 0) {
			if (instrumentOption === 10) {
				optionPrice = Math.floor(selectedCurriculum.instrument_rental_fee / months);
				optionText = '악기대여';
			} else if (instrumentOption === 20) {
				optionPrice = Math.floor(selectedCurriculum.instrument_discount / months);
				optionText = '개인악기';
			} else if (instrumentOption === 30) {
				optionPrice = Math.floor(selectedCurriculum.instrument_price / months);
				optionText = '악기구매';
			}
		}
		let totalPrice = monthlyFee + (instrumentOption == 20 ? -optionPrice : optionPrice);

		return { monthlyFee, optionPrice, optionText, totalPrice };
	}, [selectedCurriculum, instrumentOption]);




	return (
		<div className={`vh-content-wrap ${visible && 'active'}`}>
			<FormProvider {...methods}>
				<form onSubmit={methods.handleSubmit(onSubmit)}>
					<input type="hidden" {...methods.register('instrument_id')} />


					<div className="apply section1 yellow-section">
						<div className="vw-inner">
							<h1 className="title">악기 선택</h1>
							<h2 className="sub-title">배우고 싶은 악기를 선택해 주세요.</h2>

							<div className="instrument-sec">
								<ul>
									{instrumentList.map((row) => (
										<li key={row.id}>
											<button type="button" onClick={() => {
												methods.setValue('instrument_id', row.id ?? 0);
												
												if (row.id === 24) {
													methods.setValue('instrument_option', 20)
												}
												const targetElement = document.querySelector('.curriculumSection');
												if (targetElement) {
													const targetY =
														targetElement.getBoundingClientRect().top + window.pageYOffset;
													smoothScrollTo(targetY, 800);
												}
											}}>
												<img src={row.id == methods.watch('instrument_id') ? row.image_file2 : row.image_file1} alt="" />
											</button>
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>


					<div className="apply section2">
						<div className="vw-inner">
							<h1 className="title">탬버린 수강방법</h1>
							<h2 className="sub-title">레슨 선생님부터 악기, 교재, MR이 모두 한번에 준비됩니다.<br />
								이제 여러분의 연주가 시작됩니다.</h2>

							<div className="home-process">
								{isMobile ? (
									<ul>
										<li>
											<img src="/images/banner/home/banner3_01.png" alt="" />
										</li>
										<li>
											<img src="/images/banner/home/banner3_02.png" alt="" />
										</li>
										<li>
											<img src="/images/banner/home/banner3_03.png" alt="" />
										</li>
										<li>
											<img src="/images/banner/home/banner3_06.png" alt="" />
										</li>
										<li>
											<img src="/images/banner/home/banner3_05.png" alt="" />
										</li>
										<li>
											<img src="/images/banner/home/banner3_04.png" alt="" />
										</li>
									</ul>
								) : (
									<ul>
										<li>
											<img src="/images/banner/home/banner3_01.png" alt="" />
										</li>
										<li>
											<img src="/images/banner/home/banner3_02.png" alt="" />
										</li>
										<li>
											<img src="/images/banner/home/banner3_03.png" alt="" />
										</li>
										<li>
											<img src="/images/banner/home/banner3_04.png" alt="" />
										</li>
										<li>
											<img src="/images/banner/home/banner3_05.png" alt="" />
										</li>
										<li>
											<img src="/images/banner/home/banner3_06.png" alt="" />
										</li>
									</ul>
								)}
							</div>
						</div>
					</div>


					<div className="apply section3">
						<div className="vw-inner">
							<div className="apply-banner">
								<p>탬버린 뮤직은 한예종 등 국내외 명문음대 선생님과 <br />
									함께하는 1:1 온라인 악기 레슨 서비스입니다.<br />
									저렴한 비용으로 악기 교육에 필요한 모든 것을 제공하여,<br />
									도농 간 문화 예술 교육 격차를 해소하고자 합니다.</p>
							</div>
						</div>
						<img src="/images/logo/logo_white.png" alt="" />
					</div>



					<div className="apply section4 yellow-section curriculumSection">
						<div className="vw-inner">
							<h1 className="title">수강권</h1>
							<h2 className="sub-title">원하시는 수강권을 선택해주세요</h2>

							<div className="curriculum-sec">
								<ul className="list">
									{curriculumList.map((row) => (
										<li>
											<ul className="column">
												<li className="img">
													<img src={row.image_file} alt="" />
												</li>
												{(row as any).list.map((child: any) => (
													<li key={`${row.id}-${child.id}`} className="button">
														{isMobile ? (
															<div className="total-classes" style={child.weekly_classes === 2 || child.months === 0 ? { marginBottom: '10px' } : { marginBottom: '30px' }} >
																총 <span>{child.total_classes}</span>회 레슨
															</div>
														) : (
															<div className="total-classes" style={child.weekly_classes === 2 || child.months === 0 ? { marginBottom: '40px' } : { marginBottom: '67px' }} >
																총 <span>{child.total_classes}</span>회 레슨
															</div>
														)}
														{child.weekly_classes == 2 && (
															<div className="discount-price">월 260,000원</div>
														)}
														{child.name == '1개월 체험레슨' && (
															<div className="discount-price">120,000원</div>
														)}

														{isMobile ? (
															<div className="price" style={child.text.text3 ? {} : { marginBottom: '35px' }} >
																월 {child.name == '1개월 체험레슨' ? (child.price.toLocaleString()) : ((child.price / child.months).toLocaleString())}원
															</div>
														) : (
															<div className="price" style={child.text.text3 ? {} : { marginBottom: '70px' }} >
																월 {child.name == '1개월 체험레슨' ? (child.price.toLocaleString()) : ((child.price / child.months).toLocaleString())}원
															</div>
														)}


														{child.text.text3 && (
															<div className="txt1">{child.text?.text3}</div>
														)}
														<div className="devide"></div>
														{
															child.name == '1개월 체험레슨' ? (
																<div className="txt3">* 악기 소지자 한정<br />
																	* 신규 회원가입시 1회 신청가능</div>
															) : (
																child.text.text1 && (
																	<div className="txt2">{child.text?.text1}</div>
																)
															)
														}
														<button type="button" onClick={() => {
															methods.setValue('curriculum_id', child.id);
															setSelectedCurriculum(child);
															if (child.name == '1개월 체험레슨') {
																methods.setValue('instrument_option', 20)
															}
															const targetElement = document.querySelector('.optionSection');
															if (targetElement) {
																const targetY =
																	targetElement.getBoundingClientRect().top + window.pageYOffset;
																smoothScrollTo(targetY, 800);
															}
														}} className={methods.watch('curriculum_id') == child.id ? 'active' : ''}>수강신청</button>


													</li>
												))}
											</ul>
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>



					<div className="apply section5">
						<div className="vw-inner">
							<div className="apply-banner2">
								<ul>
									<li>
										<h1>1. 체계적인 커리큘럼</h1>
										<p>탬버린뮤직의 커리큘럼은<br />
											한예종 음악학과 출신 연구진이 직접 개발합니다.<br />
											주입식 교육이 아닌 악기를 연주하다보면 자연스럽게<br />
											음악이론을 습득할 수 있도록 설계되었습니다.</p>
									</li>
									<li>
										<h1>2. 수준높은 강사진</h1>
										<p>탬버린뮤직에는 국내외 명문 음대 출신<br />
											선생님만 강의하고 계십니다.<br />
											또한 모든 선생님은 탬버린뮤직의 3단계의 검증<br />
											과정을 통과하셨기 때문에 믿고 맡기셔도 좋습니다.</p>
									</li>
									<li>
										<h1>3. 자유로운 악기 선택</h1>
										<p>내가 선택한 악기가 나와 맞지 않는다면<br />
											3개월이 지난 뒤에 악기 변경 신청이 가능합니다.<br /><br /><br /></p>
									</li>
								</ul>
							</div>
						</div>
						<img src="/images/logo/logo_white.png" alt="" />
					</div>



					<div className="apply section6 yellow-section optionSection">
						<div className="vw-inner">
							<h1 className="title">악기 여부</h1>
							<h2 className="sub-title">악기 옵션을 선택해주세요.</h2>

							<div className="btn-cont">
								{/* <button type="button" onClick={() => {
									if (selectedCurriculum!.name == '1개월 체험레슨') {
										alert('1개월 체험레슨은 개인 악기로만 신청 가능합니다.');
									} else {
										methods.setValue('instrument_option', 10);
									}
								}} className={methods.watch('instrument_option') == 10 ? 'active' : ''}>악기 대여</button> */}
								<button type="button" onClick={() => {
									methods.setValue('instrument_option', 20)
								}} className={methods.watch('instrument_option') == 20 ? 'active' : ''}>개인 악기</button>
								<button type="button" onClick={() => {
									if (selectedCurriculum!.name == '1개월 체험레슨') {
										alert('1개월 체험레슨은 개인 악기로만 신청 가능합니다.');
									} else if (selectedInstrumentId == 24) {
										alert('바이올린은 악기 보유자만 신청 가능합니다.');
									} else {
										methods.setValue('instrument_option', 30)
									}
								}} className={methods.watch('instrument_option') == 30 ? 'active' : ''}>악기 구매</button>
							</div>

							<ul className="faq-cont">
								<li>
									<div className="faq-header" onClick={() => toggleFAQ(1)}>
										<h1>유의사항</h1>
										<i className={openIndexes.includes(1) ? "fas fa-angle-down" : "fas fa-angle-right"}></i>
									</div>
									<div className={`faq-content ${openIndexes.includes(1) ? 'open' : ''}`} >
										<img src="/images/banner/apply/faq-001.jpg" alt="" />
									</div>
								</li>
								<li>
									<div className="faq-header" onClick={() => toggleFAQ(2)}>
										<h1>혜택 안내</h1>
										<i className={openIndexes.includes(2) ? "fas fa-angle-down" : "fas fa-angle-right"}></i>
									</div>
									<div className={`faq-content ${openIndexes.includes(2) ? 'open' : ''}`}>
										<img src="/images/banner/apply/faq-002.jpg" alt="" />
									</div>
								</li>
								<li>
									<div className="faq-header" onClick={() => toggleFAQ(3)}>
										<h1>환불 규정</h1>
										<i className={openIndexes.includes(3) ? "fas fa-angle-down" : "fas fa-angle-right"}></i>
									</div>
									<div className={`faq-content ${openIndexes.includes(3) ? 'open' : ''}`}>
										<img src="/images/banner/apply/faq-003.jpg" alt="" />
									</div>
								</li>
								{/* <li>
									<div className="faq-header" onClick={() => toggleFAQ(4)}>
										<h1>악기 반환 및 변경 규정</h1>
										<i className={openIndexes.includes(4) ? "fas fa-angle-down" : "fas fa-angle-right"}></i>
									</div>
									<div className={`faq-content ${openIndexes.includes(4) ? 'open' : ''}`}>
										<img src="/images/banner/apply/faq-04.jpg" alt="" />
									</div>
								</li> */}
							</ul>

							<div className="faq-bottom">
								<h1>원하는 내용을 찾지 못하셨다면 카카오톡으로 문의해 주세요.</h1>
								<a href="https://pf.kakao.com/_UPqrb" target="_blank">
									<button type="button"><img src="/images/icon/common/kakao_channel.png" alt="" /> @탬버린 뮤직</button>
								</a>
							</div>
						</div>
					</div>


					{
						selectedCurriculum && (
							<div className="floating-bar">
								<div className="vw-inner">
									<ul>
										<li>
											<h1>{selectedCurriculum.name == '1개월 체험레슨' ? 1 : selectedCurriculum.months}개월 수강신청</h1>
											<h2>+ {selectedCurriculum.text?.text2}</h2>
										</li>
										<li>
											<div className="info-box">
												<p>1개월 수업료</p>
												{selectedCurriculum.months > 0 && <p>+ {optionText}</p>}
											</div>
											<div className="info-box">
												<p>
													월 {monthlyFee.toLocaleString()}원
													<br />
													{selectedCurriculum.months > 0 && (
														<span>{optionPrice > 0 && '월 '}{(instrumentOption == 20 && optionPrice > 0) && '-'}{optionPrice.toLocaleString()}원</span>
													)}
												</p>
											</div>
										</li>
										<li>
											{isAuthenticated ? (
												<button type="submit">월 {totalPrice!.toLocaleString()}원 결제하기</button>
											) : (
												<button type="button" onClick={() => {
													alert('회원 전용 페이지 입니다.');
												}}>월 {totalPrice!.toLocaleString()}원 결제하기</button>

											)}

										</li>
									</ul>
								</div>
							</div>
						)
					}


				</form>
			</FormProvider>
		</div>
	);
}

export default Apply;
