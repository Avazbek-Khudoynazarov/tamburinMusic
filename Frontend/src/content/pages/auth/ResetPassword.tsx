import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MemberService from '@/services/MemberService';

function ResetPassword() {
	const navigate = useNavigate();
	const [visible, setVisible] = useState(false);
	const [form, setForm] = useState({
		cellphone: '',
		userId: '',
		certifyNo: '',
		password: '',
		passwordRe: '',
		resultUserId: '',
	});


	const [certifyingEmail, setCertifyingEmail] = useState(false);
	const [certify, setCertify] = useState(false);



	async function loadInitialData() {
		setVisible(true);
	}

	useEffect(() => {
		loadInitialData();
	}, []);



	const handleInput = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({
			...prev,
			[name]: value,
		}));
	};



	const findId = async () => {
		if (form.cellphone.length < 11) {
			alert('전화번호를 입력해 주세요.');
			return;
		}



		try {

			let formattedCellphone = form.cellphone;
			if (form.cellphone.length == 11) {
				formattedCellphone = form.cellphone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
			}

			const result = await MemberService.getByCellphone(formattedCellphone);
			if (result) {
				setForm(prev => ({
					...prev,
					resultUserId: result.user_id,
				}));

			} else {
				alert("일치하는 전화번호가 없습니다.");
			}
		} catch (error) {
			console.error(error);
			alert("아이디 찾기 중 오류가 발생하였습니다.");
		}
	}




	const findPass = async () => {
		if (form.userId.length < 4) {
			alert('아이디를 3글자 이상 입력해주세요.');
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!emailRegex.test(form.userId)) {
			alert('아이디가 올바른 이메일 형식이 아닙니다.');
			return;
		}

		try {
			setCertifyingEmail(true);
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
				email: form.userId,
				subject:'[탬버린뮤직] 비밀번호 찾기 인증번호 안내 메일입니다.',
				type: '비밀번호찾기',
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

		} catch (error) {
			console.error(error);
			alert("이메일 인증 오류가 발생했습니다.");
		}
	}





	const certifyEmail = async () => {
		if (!form.userId) {
			alert('이메일 주소를 입력해주세요.');
			return;
		}
		if (!form.certifyNo || form.certifyNo.length !== 6) {
			alert('올바른 인증번호를 입력해주세요.');
			return;
		}


		try {

			const result = await MemberService.verificateMail(form.userId, form.certifyNo);
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
	}





	const changePass = async () => {
		if (form.userId.length < 4) {
			alert('아이디를 입력해 주세요.');
			return;
		}

		if (form.password.length < 6) {
			alert('비밀번호를 6글자 이상 입력해주세요.');
			return;
		}

		if (form.password !== form.passwordRe) {
			alert('동일한 비밀번호를 입력해주세요.');
			return;
		}


		try {


			const result = await MemberService.updatePassword(form.userId, form.password);
			if (result) {
				alert('비밀번호가 변경되었습니다.');
				navigate('/auth/login');

			} else {
				alert("일치하는 전화번호가 없습니다.");
			}
		} catch (error) {
			console.error(error);
			alert("아이디 찾기 중 오류가 발생하였습니다.");
		}
	}


	return (
		<div className={`vh-content-wrap ${visible && 'active'}`}>
			<div className="reset-password">
				<div className="vw-inner">

					<h1 className="title pc_only">아이디 / 비밀번호 찾기</h1>
					<ul className="box">
						<li>
							<h1>아이디 찾기</h1>
							<ul>
								{!form.resultUserId ?
									(
										<li>
											<h1>전화번호*</h1>
											<input type="text" name="cellphone" value={form.cellphone} onChange={handleInput} />
										</li>
									) :
									(
										<li>
											<h1>아이디*</h1>
											<input type="text" value={form.resultUserId} readOnly={true} style={{ background: '#e8f0fe' }} />
										</li>
									)
								}
							</ul>
							<div className="btn_area board-btn">
								<button type="button" onClick={findId} className="update">확인</button>
							</div>
						</li>



						<li>
							<h1>비밀번호 찾기</h1>
							<ul>
								<li>
									<h1>아이디*</h1>
									<input type="text" name="userId" readOnly={certifyingEmail} value={form.userId} onChange={handleInput} />
								</li>
								{
									certifyingEmail && (
										<>
											<li>
												<h1>인증번호</h1>
												<div className="filed-row">
													<input type="text" name="certifyNo" value={form.certifyNo} onChange={handleInput} />
													<button type="button" onClick={certifyEmail} style={{ border: '2px solid #232323', color: '#232323', background: 'transparent', fontSize: '13px', padding: '10px 20px', fontWeight: 500, marginLeft: '10px' }}>인증완료</button>
												</div>
											</li>
											{
												certify && (
													<>
														<li>
															<h1>비밀번호*</h1>
															<input type="text" name="password" value={form.password} onChange={handleInput} />
														</li>
														<li>
															<h1>비밀번호 확인*</h1>
															<input type="text" name="passwordRe" value={form.passwordRe} onChange={handleInput} />
														</li>
														<li>
															<p>비밀번호는 <strong>6글자 이상, 12글자 이하</strong>로 입력해 주세요.</p>
														</li>
													</>
												)
											}
										</>
									)
								}
							</ul>
							<div className="btn_area board-btn">
								{
									!certify && (
										<button type="button" onClick={findPass} className="update">확인</button>
									)
								}

								{
									certifyingEmail && certify && (
										<button type="button" onClick={changePass} className="update">비밀번호 변경</button>
									)
								}
							</div>
						</li>
					</ul>

				</div>
			</div>
		</div>
	);
}

export default ResetPassword;
