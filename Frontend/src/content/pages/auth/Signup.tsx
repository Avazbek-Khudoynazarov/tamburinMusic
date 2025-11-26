import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';

import { Member } from '@/models/member';

import useGlobalStore from '@/stores/globalStore';
import AuthService from '@/services/AuthService';
import MemberService from '@/services/MemberService';


const schema = zod.object({
	user_id: zod
		.string()
		.min(5, { message: '아이디는 이메일 형식으로 5글자 이상 입력해 주세요.' })
		.email({ message: '아이디는 이메일 형식으로 5글자 이상 입력해 주세요.' }),
	password: zod
		.string()
		.min(5, { message: '비밀번호는 5글자 이상 입력해 주세요.' }),
	name: zod
		.string()
		.min(2, { message: '이름은 2글자 이상 입력해 주세요.' }),
	cellphone: zod
		.string()
		.min(11, { message: '연락처는 11글자 이상 입력해 주세요.' }),
	address1: zod
		.string()
		.min(5, { message: '주소는 5글자 이상 입력해 주세요.' }),
	gender: zod
		.string()
		.min(1, { message: '성별을 선택해주세요' }),
	school_name: zod.string(),
	grade: zod.string(),
	memo: zod.string(),
	parent_name: zod.string(),
	parent_cellphone: zod.string(),
	status: zod.number(),
	approve_date: zod.date().optional(),
	agree_marketing: zod.string().optional(),
	notification_type: zod.string().optional(),
	registration_source: zod.string().optional(),
	created_date: zod.date().optional()
});



function Signup() {
	const navigate = useNavigate();
	const { state } = useLocation();
	const { setAuthenticated, setMember } = useGlobalStore();
	const [visible, setVisible] = useState(false);

	const [authCode, setAuthCode] = useState('');
	const [certify, setCertify] = useState(false);
	const [certifying, setCertifying] = useState(false);
	const [message, setMessage] = useState("");
	const [memberRow, setMemberRow] = useState<Member>();

	const [passRe, setPassRe] = useState('');
	const [agree, setAgree] = useState(false);

	const [isSubmittingForm, setIsSubmittingForm] = useState(false);

	// Email verification bypass for local development
	const requireEmailVerification = import.meta.env.VITE_REQUIRE_EMAIL_VERIFICATION !== 'false';

	const defaultValues: Member = {
		id: 0,
		type: 10,
		user_id: "",
		password: "",
		login_type: "",
		login_ci_data: "",
		name: "",
		nickname: "",
		cellphone: "",
		image_file: "",
		address1: "",
		address2: "",
		address3: "",
		zip: "",
		foreign_address: "",
		gender: "남자",
		school_name: "",
		grade: "",
		memo: "",
		zoom_link_url: "",
		voov_link_url: "",
		voov_link_exposed_members: "",
		parent_name: "",
		parent_cellphone: "",
		total_payments: 0,
		total_price: 0,
		remaining_classes: 0,
		status: 20,
		approve_date: new Date(),
		leave_date: undefined,
		leave_message: "",
		agree_marketing: "미동의",
		notification_type: "카카오알림톡",
		registration_source: "지인소개",
		last_login: undefined,
		created_date: new Date()
	};


	const {
		register,
		handleSubmit,
		reset,
		setValue,
		watch,
		formState: { errors }
	} = useForm<Member>({
		resolver: zodResolver(schema),
		defaultValues,
	});

	const agreeMarketing = watch('agree_marketing');


	async function loadInitialData() {
		if (state?.member_id) {
			const row = await MemberService.get(state?.member_id);
			if (row) {
				setMemberRow(row);
			}
		}
		setVisible(true);
	}

	useEffect(() => {
		loadInitialData();
		// Auto-certify if email verification is disabled
		if (!requireEmailVerification) {
			setCertify(true);
		}
	}, []);



	const onSubmit = async (data: Member) => {
		if (isSubmittingForm) return;
  	setIsSubmittingForm(true);

		const userId = watch('user_id');
		const name = watch('name');
		const cellphone = watch('cellphone');
		const password = watch('password');
		const notificationType = watch('notification_type');

		try {
			if (!agree) {
				alert('이용약관, 개인정보취급방침에 동의하셔야 회원가입이 가능합니다.');
				return;
			}
			if (password !== passRe) {
				alert('비밀번호 확인을 정확히 입력해주세요.');
				return;
			}

			// 이메일 인증 마지막으로 체크
			let resultCertify;
			if (requireEmailVerification) {
				resultCertify = await MemberService.isCertifyEmail(userId ?? '', authCode);
			} else {
				// Bypass email verification for local development
				resultCertify = [{ id: 1 }]; // Mock successful verification
			}

			if (resultCertify && resultCertify.length > 0 && resultCertify[0].id) {

				const payload = {
					...defaultValues,
					...data,
					id: memberRow?.id ?? defaultValues.id,
					login_type: memberRow?.login_type ?? defaultValues.login_type,
					login_ci_data: memberRow?.login_ci_data ?? defaultValues.login_ci_data,
				};




				// 회원가입
				let result = [];
				if (payload.id) {
					result = await MemberService.update(payload);

				} else {
					const { id, ...rest } = payload;
					result = await MemberService.create(rest);
				}



				/* 
					알림 발송 
				*/



				// 회원 알림 발송
				if(notificationType == '카카오알림톡') {
					await MemberService.sendKakao({
						phone: cellphone ? cellphone.replace(/-/g, "") : '',
						code: 'TK_7736',
						content: `[탬버린 뮤직] 
홈페이지 가입을 감사드립니다.
상단의 ‘채널추가’를 누르시면 수업과 관련된 모든 과정을 알림톡을 통해 자세하게 안내 받으실 수 있습니다.

궁금한 점이나 건의사항, 요청사항이 있으시면 알림톡을 통해 문의 남겨주시면 최선을 다해 답변드리도록 하겠습니다. 

감사합니다.

탬버린 뮤직 드림`
					});

				} else {
					await MemberService.sendEmail({
						email: userId,
						subject:'[탬버린 뮤직] 홈페이지 가입을 감사드립니다.',
						content: `[탬버린 뮤직] <br>
홈페이지 가입을 감사드립니다.<br>
상단의 ‘채널추가’를 누르시면 수업과 관련된 모든 과정을 알림톡을 통해 자세하게 안내 받으실 수 있습니다.<br>
궁금한 점이나 건의사항, 요청사항이 있으시면 알림톡을 통해 문의 남겨주시면 최선을 다해 답변드리도록 하겠습니다. <br>
감사합니다.<br>
탬버린 뮤직 드림`
					});
				}


				if (result) {
					
					// 관리자 알림 발송
					await MemberService.sendKakao({
						phone: '01051321404',
						code: 'TH_8111',
						content: `${name}님이 회원가입을 하였습니다.`
					});


					alert("회원가입이 완료 되었습니다.");
					navigate('/auth/login');
				} else {
					alert("회원가입이 실패했습니다.");
				}

			} else {
				alert("인증되지 않은 이메일 입니다.");
			}
		} catch (error) {
			console.error(error);
			alert("오류가 발생했습니다. 다시 시도해주세요.");
		}
	};

	// console.log(errors);






	const sendEmail = async () => {
		const userId = watch('user_id')!;

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!emailRegex.test(userId)) {
			alert('아이디가 올바른 이메일 형식이 아닙니다.');
			return;
		}

		try {

			const result = await MemberService.isEmailDuplicate(userId);
			if (result) {
				if (result.type == 'success') {
					setCertifying(true);
					alert('메일이 발송 되었습니다. \n인증 메일을 확인해주세요.');


					const now = new Date();
					const nowDate = now;
		
					const year = now.getFullYear();
					const month = String(now.getMonth() + 1).padStart(2, '0');
					const day = String(now.getDate()).padStart(2, '0');
					const hours = String(now.getHours()).padStart(2, '0');
					const minutes = String(now.getMinutes()).padStart(2, '0');
					const seconds = String(now.getSeconds()).padStart(2, '0');
					// 형식에 맞춰 문자열로 조합
					const formattedDate = `${year}년 ${month}월 ${day}일 ${hours}:${minutes}:${seconds}`;
		
					const futureDate = new Date(now);
					futureDate.setMinutes(now.getMinutes() + 10);
		
		
					const randomSixDigitNumber = Math.floor(Math.random() * 900000) + 100000;



					await MemberService.sendEmail({
						email: userId,
						subject: '[탬버린뮤직] 회원가입 인증번호 안내 메일입니다.',
						type: '회원가입',
						token: randomSixDigitNumber,
						content: `<table align="center" width="780px" border="0" cellpadding="0" cellspacing="0">
	<tbody>
	<tr>
		<td style="background:#fff; padding:30px 0 40px 30px; border-top:1px solid #b6b6b6; border-left:1px solid #b6b6b6; border-right:1px solid #b6b6b6; font-family:dotum, sans-serif; line-height:22px; color:#666;">
			 안녕하세요. 탬버린 뮤직 입니다. <br>
			<span style="color:#d00000;">탬버린 뮤직(tamburinmusic.com)</span>의 안전한 이용을 위해 이메일 인증을 진행합니다. <br>
			<br>
			아래 인증번호를 <span style="color:#f26522;font-weight:bold">입력하여</span> 인증을 완료해 주세요. <br>
			개인정보보호를 위해 발송된 <span style="color:#f26522;font-weight:bold">인증번호는 10분간 유효</span>합니다.
		</td>
	</tr>
	<tr>
		<td style=" background:#fff; padding-left:30px; border-left:1px solid #b6b6b6; border-right:1px solid #b6b6b6;">
			<table width="718" border="0" cellspacing="0" cellpadding="0" summary="인증번호 안내">
			<tbody>
			<tr>
				<td height="3" colspan="2" style="background:#333;">
				</td>
			</tr>
			<tr>
				<td align="center" width="150" height="38" style="background:#f7f7f7;font-family:dotum, sans-serif; font-size:12px; color:#111; font-weight:bold">
					인증번호
				</td>
				<td style="padding-left:20px; font-family:dotum, sans-serif; font-size:15px; color:#111; font-weight:bold">
					${randomSixDigitNumber}
				</td>
			</tr>
			<tr>
				<td height="1" colspan="2" style="background:#d2d2d2;">
				</td>
			</tr>
			<tr>
				<td align="center" height="38" style="background:#f7f7f7;font-family:dotum, sans-serif; font-size:12px; color:#111;font-weight:bold">
					발급시간
				</td>
				<td style="padding-left:20px; font-family:dotum, sans-serif; font-size:12px; color:#d00000;font-weight:bold">
					${formattedDate}
				</td>
			</tr>
			<tr>
				<td height="2" colspan="2" style="background:#d2d2d2;">
				</td>
			</tr>
			</tbody>
			</table>
		</td>
	</tr>
	<tr>
		<td style="background:#fff; padding:40px 0 20px 30px; border-left:1px solid #b6b6b6; border-right:1px solid #b6b6b6;border-bottom:1px solid #b6b6b6;  font-family:dotum, sans-serif; font-size:11px; color:#333; line-height:22px; ">
			 본 메일은 발신전용으로 회신되지 않습니다. 
		</td>
	</tr>
	</tbody>
	<!--footer-->
	</table>`
					});

				} else if (result.type == 'error') {
					alert("이미 사용중인 이메일 입니다");
				}

			} else {
				alert("이메일 인증 오류가 발생했습니다.");
			}
		} catch (error) {
			console.error(error);
			alert("이메일 인증 오류가 발생했습니다.");
		}
	}



	const handleInputChange = (e) => {
		setAuthCode(e.target.value);
	};

	const handleInputPassword = (e) => {
		setPassRe(e.target.value);
	};

	const handleCheckAgree = (e) => {
		setAgree(e.target.value);
	};

	const handleChangeAgreeMarketing = (e) => {
		setValue('agree_marketing', e.target.checked ? '동의' : '미동의');
	};




	const handleVerifyClick = async () => {
		const userId = watch('user_id');

		if (!userId) {
			alert('이메일 주소를 입력해주세요.');
			return;
		}
		if (!authCode || authCode.length !== 6) {
			alert('올바른 인증번호를 입력해주세요.');
			return;
		}


		try {

			const result = await MemberService.verificateMail(userId, authCode);
			if (result && result.length > 0 && result[0].id) {
				await MemberService.certifyMail(result[0]);
				alert('인증이 완료 되었습니다.');
				setCertify(true);

			} else {
				alert("올바른 인증번호를 입력해주세요.");
			}
		} catch (error) {
			console.error(error);
			alert("인증번호 검증 오류가 발생했습니다.");
		}
	};





	return (
		<div className={`vh-content-wrap ${visible && 'active'}`}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="signup">
					<div className="vw-inner">

						<img src="/images/banner/signup/banner_01.png" alt="" className="visual" />
						<ul className="box">
							<li className="header">
								<h1>1. 이메일 인증</h1>
								<p className="notice">※ 학부모(보호자)이신가요 자녀(학생)의 정보 기준으로 가입해 주세요.</p>
								{!requireEmailVerification && (
									<p style={{ color: '#f26522', fontSize: '14px', fontWeight: 'bold', marginTop: '10px' }}>
										🔓 개발 모드: 이메일 인증이 비활성화되었습니다.
									</p>
								)}
							</li>
							<li>
								<div className="form-group">
									<div className="txt-cont">
										<label>이메일 주소</label>
										<input type="text" placeholder="탬버린에서 쓸 아이디" {...register('user_id')} readOnly={certify && requireEmailVerification} />
										{errors.user_id && <p style={{ color: 'red', fontSize: '14px', paddingLeft: '5px', paddingBottom: '10px' }}>{errors.user_id.message}</p>}
									</div>
									{
										!certify && requireEmailVerification && (
											<>
												<button type="button" className="btn-certify" onClick={() => sendEmail()}>이메일 인증</button>
												{
													certifying && (
														<div className="field-row">
															<input type="text" value={authCode} onChange={handleInputChange} placeholder="인증 번호" />
															<button type="button" onClick={handleVerifyClick}>인증 완료</button>
														</div>
													)
												}

											</>
										)
									}

								</div>
							</li>
						</ul>

						<ul className="box">
							<li className="header">
								<h1>2. 필수 정보 입력</h1>
							</li>
							{
								!certify && (
									<li className="header">
										<p className="need-certify">이메일 인증을 먼저 진행해주세요!</p>
									</li>
								)
							}
							{
								certify && (
									<li>
										<div className="form-group">
											<div className="txt-cont">
												<label>비밀번호</label>
												<input type="password" {...register('password')} placeholder="********" />
												{errors.password && <p style={{ color: 'red', fontSize: '14px', paddingLeft: '5px', paddingBottom: '10px' }}>{errors.password.message}</p>}
											</div>
											<div className="txt-cont">
												<label>비밀번호 확인</label>
												<input type="password" placeholder="********" value={passRe} onChange={handleInputPassword} />
											</div>
											<div className="field-row">
												<input type="text" {...register('name')} placeholder="이름" />
												{errors.name && <p style={{ color: 'red', fontSize: '14px', paddingLeft: '5px', paddingBottom: '10px' }}>{errors.name.message}</p>}
												<div className="radio-cont">
													<div className="form-check">
														<input className="form-check-input" type="radio" {...register('gender')}  id="gender1" value="남자" />
														<label className="form-check-label" htmlFor="gender1">
															남
														</label>
													</div>
													<div className="form-check">
														<input className="form-check-input" type="radio" {...register('gender')}  id="gender2" value="여자" />
														<label className="form-check-label" htmlFor="gender2">
															여
														</label>
													</div>
													{/* <div className="checkbox check-type-03">
														<input type="radio" name="gender" {...register('gender')} value="남자" />
														<label>
															<span>남</span>
														</label>
													</div>
													<div className="checkbox check-type-03">
														<input type="radio" name="gender" {...register('gender')} value="여자" />
														<label>
															<span>여</span>
														</label>
													</div> */}
													{errors.gender && <p style={{ color: 'red', fontSize: '14px', paddingLeft: '5px', paddingBottom: '10px' }}>{errors.gender.message}</p>}
												</div>
											</div>
											<input type="text" {...register('cellphone')} placeholder="연락처 '-' 포함 입력" />
											{errors.cellphone && <p style={{ color: 'red', fontSize: '14px', paddingLeft: '5px', paddingBottom: '10px' }}>{errors.cellphone.message}</p>}
											<input type="text" {...register('address1')} placeholder="주소" />
											{errors.address1 && <p style={{ color: 'red', fontSize: '14px', paddingLeft: '5px', paddingBottom: '10px' }}>{errors.address1.message}</p>}

											<div className="devide"></div>

											<div className="form-check">
												<input className="form-check-input" type="radio" {...register('notification_type')} id="notification_type1" value="카카오알림톡" />
												<label className="form-check-label" htmlFor="notification_type1">
													카카오 알림톡
												</label>
											</div>
											<div className="form-check">
												<input className="form-check-input" type="radio" {...register('notification_type')} id="notification_type2" value="이메일" />
												<label className="form-check-label" htmlFor="notification_type2">
													이메일 알림
												</label>
											</div>
											<p className="notice" style={{  paddingLeft : 0}}>**수업 알림을 받을 방법을 선택해주세요.</p>

											<div className="devide"></div>

											<div className="form-check">
												<input className="form-check-input" type="radio" {...register('registration_source')} id="registration_source1" value="지인소개" />
												<label className="form-check-label" htmlFor="registration_source1">
												지인소개
												</label>
											</div>
											<div className="form-check">
												<input className="form-check-input" type="radio" {...register('registration_source')} id="registration_source2" value="인스타그램" />
												<label className="form-check-label" htmlFor="registration_source2">
												인스타그램
												</label>
											</div>
											<div className="form-check">
												<input className="form-check-input" type="radio" {...register('registration_source')} id="registration_source3" value="페이스북" />
												<label className="form-check-label" htmlFor="registration_source3">
												페이스북
												</label>
											</div>
											<div className="form-check">
												<input className="form-check-input" type="radio" {...register('registration_source')} id="registration_source4" value="인터넷검색" />
												<label className="form-check-label" htmlFor="registration_source4">
												인터넷검색
												</label>
											</div>
											<div className="form-check">
												<input className="form-check-input" type="radio" {...register('registration_source')} id="registration_source5" value="블로그" />
												<label className="form-check-label" htmlFor="registration_source5">
												블로그
												</label>
											</div>
											<div className="form-check">
												<input className="form-check-input" type="radio" {...register('registration_source')} id="registration_source6" value="기타" />
												<label className="form-check-label" htmlFor="registration_source6">
												기타
												</label>
											</div>
											<p className="notice" style={{  paddingLeft : 0}}>**알게된 경로를 선택해주세요.</p>

										</div>

									</li>
								)
							}
						</ul>

						<ul className="box additional">
							<li className="header">
								<h1>3. 추가 정보 입력 <span>* 학생일 경우 필수</span></h1>
							</li>
							{
								!certify && (
									<li className="header">
										<p className="need-certify">이메일 인증을 먼저 진행해주세요!</p>
									</li>
								)
							}
							{
								certify && (
									<li>
										<div className="form-group">
											<div className="txt-cont">
												<label>학교</label>
												<input type="text" {...register('school_name')} placeholder="학교이름" />
											</div>
											<div className="txt-cont">
												<label>학년</label>
												<input type="text" {...register('grade')} placeholder="학년" />
											</div>
											<div className="txt-cont">
												<label>참고</label>
												<input type="text" {...register('memo')} placeholder="참고사항 (선택)" />
											</div>
											<div className="devide"></div>
											<div className="txt-cont">
												<label>부모님</label>
												<input type="text" {...register('parent_name')} placeholder="부모님 이름" style={{ marginBottom: 0 }} />
											</div>
											<p className="notice" style={{ marginBottom: '20px' }}>*부모님 성함을 정확히 입력해주세요.</p>
											<input type="text" {...register('parent_cellphone')} placeholder="휴대전화 '-' 포함 입력" style={{ marginBottom: 0 }} />
											<p className="notice">**부모님 휴대폰 번호를 정확히 입력해주세요.</p>
										</div>
									</li>
								)
							}
						</ul>

						{
							certify && (
								<>
									<div className='agree-cont'>
										<div>
											<div className="form-check">
												<input
													className="form-check-input"
													id="agree1"
													type="checkbox"
													{...register('agree_marketing')}
													checked={agreeMarketing === '동의'}
													onChange={handleChangeAgreeMarketing}
													value="동의" />
												<label className="form-check-label chk" htmlFor="agree1">
													마케팅 정보 수신 동의(선택)
												</label>
											</div>
										</div>

										<div>
											<div className="form-check">
												<input
													className="form-check-input"
													type="checkbox"
													checked={agree}
													onChange={handleCheckAgree}
												/>
												<label className="form-check-label chk">
													<span>탬버린 <a href="/auth/agreement" target="_blank">이용약관,</a> <a href="/auth/privacyPolicy" target="_blank">개인정보취급방침</a> 동의 (필수)</span>
												</label>
											</div>
										</div>

										{/* <div>
											<div className="checkbox check-type-03 agree">
												<input
													type="checkbox"
													name="agree_marketing"
													{...register('agree_marketing')}
													checked={agreeMarketing === '동의'}
													onChange={handleChangeAgreeMarketing}
													value="동의"
												/>
												<label>
													<span>마케팅 정보 수신 동의(선택)</span>
												</label>
											</div>
										</div>

										<div className="need-agree">
											<div className="checkbox check-type-03 agree">

												<input type="checkbox" name="agree" checked={agree} onChange={handleCheckAgree} />
												<label>
													<span>탬버린 <Link to="">이용약관,</Link> <Link to="">개인정보취급방침</Link> 동의 (필수)</span>
												</label>
											</div>
										</div> */}
									</div>


									<div className="btn_area">
										<button type="submit">회원가입하기</button>
									</div>
								</>
							)
						}





					</div>
				</div>
			</form>
		</div>

	);
}



export default Signup;
