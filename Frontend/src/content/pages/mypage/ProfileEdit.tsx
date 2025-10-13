import { useMemo, useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import MD5 from 'crypto-js/md5';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import useGlobalStore from '@/stores/globalStore';
import { Form, Field } from '@/components/UI/Minimal/components/hook-form';

import SHA512 from 'crypto-js/sha512';
import Base64 from 'crypto-js/enc-base64';

import { Member } from '@/models/member';

import MemberService from '@/services/MemberService';


const schema = zod.object({
	id: zod.number(),
	name: zod.string().min(2, { message: '이름을 입력해 주세요' }),
	cellphone: zod.string(),
	address1: zod.string(),
	school_name: zod.string(),
	grade: zod.string(),
	memo: zod.string(),
	parent_name: zod.string(),
	parent_cellphone: zod.string(),
	notification_type: zod.string(),
});


function ProfileEdit() {
	const [visible, setVisible] = useState(false);
	const navigate = useNavigate();
	const { isAuthenticated, member } = useGlobalStore();
	const [memberRow, setMemberrow] = useState<Member>();

	const [showInput, setShowInput] = useState(false);
	const [currentPassword, setCurrentPassword] = useState('');
	const [verified, setVerified] = useState(false);
	const [newPassword, setNewPassword] = useState('');
	const [error, setError] = useState('');


	const defaultValues = {};


	const methods = useForm<Member>({
		resolver: zodResolver(schema),
		defaultValues
	});


	async function loadInitialData() {
		setMemberrow(await MemberService.get(Number(member?.id)));
		setVisible(true);
	}

	useEffect(() => {
		loadInitialData();
	}, []);


	useEffect(() => {
		if (memberRow) {
			methods.reset({
				...memberRow,
			})
		}
	}, [memberRow, methods.reset]);


	// console.log(methods.formState.errors);


	const onError = (errors) => {
		if (errors.subject) {
			alert(errors.subject.message);
		} else if (errors.content) {
			alert(errors.content.message);
		}
	};

	const onSubmit = async (data: Member) => {
		console.log(data);
		try {
			const result = await MemberService.update(data);

			if (result) {
				alert("회원정보 수정이 완료 되었습니다.");
			} else {
				alert("회원정보 수정이 실패했습니다.");
			}
		} catch (error) {
			console.error(error);
			alert("오류가 발생했습니다. 다시 시도해주세요.");
		}
	}




	const handleVerify = async () => {
		// 예시로 현재 비밀번호가 "password123"라고 가정
		const correctPassword = memberRow?.password;
		// const cryptedPassword = Base64.stringify(SHA512(currentPassword));
		const cryptedPassword = MD5(currentPassword).toString();
		// console.log(correctPassword);
		// console.log(cryptedPassword);
		if (cryptedPassword === correctPassword) {
			setVerified(true);
			setError('');
		} else {
			setError('현재 비밀번호가 일치하지 않습니다.');
		}
	};


	// 새로운 비밀번호 업데이트
	const handleUpdate = async () => {
		if (newPassword.trim().length < 4) {
			setError('새로운 비밀번호는 최소 4글자 이상이어야 합니다.');
			return;
		}
		try {
			await MemberService.updatePassword(memberRow?.user_id!, newPassword.trim());
			loadInitialData();
			alert('비밀번호 수정이 완료 되었습니다.');
			// 상태 초기화
			setCurrentPassword('');
			setNewPassword('');
			setVerified(false);
			setShowInput(false);
			setError('');
		} catch (err) {
			console.error(err);
			setError('비밀번호 업데이트 중 오류가 발생했습니다.');
		}
	};



	return (
		<div className={`vh-content-wrap ${visible && 'active'}`}>
			<FormProvider {...methods}>
				<form onSubmit={methods.handleSubmit(onSubmit, onError)}>
					<div className="profile-edit">
						<div className="vw-inner">

							<h1 className="title">회원정보수정</h1>
							<ul className="board-form">
								<li>
									<h2>아이디</h2>
									<p className="info">{memberRow?.user_id}</p>
								</li>
								<li>
									<h2>비밀번호</h2>
									<div className="info-box">
										{/* <button type="button" className="blue-btn">비밀번호 변경</button> */}
										{!showInput ? (
											<button type="button" className="blue-btn" onClick={() => setShowInput(true)}>비밀번호 변경</button>
										) : (
											<div>
												{!verified ? (
													// 현재 비밀번호 입력란과 확인 버튼
													<div>
														<input
															type="password"
															className="w300"
															placeholder="현재 비밀번호 입력"
															value={currentPassword}
															style={{ marginRight: '10px' }}
															onChange={(e) => setCurrentPassword(e.target.value)}
														/>
														<button type="button" className="blue-btn" onClick={handleVerify}>확인</button>
														{error && <p style={{ color: 'red' }}>{error}</p>}
													</div>
												) : (
													// 새로운 비밀번호 입력란과 변경완료 버튼
													<div>
														<input
															type="password"
															className="w300"
															placeholder="새로운 비밀번호 입력"
															value={newPassword}
															style={{ marginRight: '10px' }}
															onChange={(e) => setNewPassword(e.target.value)}
														/>
														<button type="button" className="blue-btn" onClick={handleUpdate}>변경완료</button>
														{error && <p style={{ color: 'red' }}>{error}</p>}
													</div>
												)}
											</div>
										)}
									</div>
								</li>
								<li>
									<h2>이름</h2>
									<div className="info-box">
										<input type="text" className="w300" {...methods.register('name')} />
									</div>
								</li>
								<li>
									<h2>연락처</h2>
									<div className="info-box">
										<input type="text" className="w300" {...methods.register('cellphone')} />
									</div>
								</li>
								<li>
									<h2>주소</h2>
									<div className="info-box">
										<input type="text" {...methods.register('address1')} />
									</div>
								</li>
								<li>
									<h2>참고사항</h2>
									<div className="info-box">
										<input type="text" {...methods.register('memo')} />
									</div>
								</li>
								<li>
									<h2>학교명</h2>
									<div className="info-box">
										<input type="text" className="w300" {...methods.register('school_name')} />
									</div>
								</li>
								<li>
									<h2>학년</h2>
									<div className="info-box">
										<input type="text" className="w300" {...methods.register('grade')} />
									</div>
								</li>
								<li>
									<h2>부모님 이름</h2>
									<div className="info-box">
										<input type="text" className="w300" {...methods.register('parent_name')} />
									</div>
								</li>
								<li>
									<h2>부모님 연락처</h2>
									<div className="info-box">
										<input type="text" className="w300" {...methods.register('parent_cellphone')} />
									</div>
								</li>
								<li>
									<h2>수업알림 수신방법</h2>
									<div className="form-check">
										<input className="form-check-input" type="radio" {...methods.register('notification_type')} id="notification_type1" value="카카오알림톡" />
										<label className="form-check-label" htmlFor="notification_type1">
											카카오 알림톡
										</label>
									</div>
									<div className="form-check">
										<input className="form-check-input" type="radio" {...methods.register('notification_type')} id="notification_type2" value="이메일" />
										<label className="form-check-label" htmlFor="notification_type2">
											이메일 알림
										</label>
									</div>
								</li>
							</ul>

							<div className="btn_area board-btn">
								<button type="submit" className="update">수정완료</button>
							</div>
						</div>
					</div>
				</form>
			</FormProvider>
		</div>
	);
}

export default ProfileEdit;
