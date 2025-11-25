import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import useGlobalStore from '@/stores/globalStore';
import AuthService from '@/services/AuthService';

import { LoginType } from '@/models/login';

declare global {
	interface Window {
		naver: any;
		Kakao: any;
	}
}
const { Kakao, naver } = window;


const LoginSchema = zod.object({
	user_id: zod.string().min(3, { message: "이메일주소는 3글자 이상이어야 합니다." }),
	password: zod.string().min(4, { message: "비밀번호는 4글자 이상이어야 합니다." }),
});


function Login() {
	const [visible, setVisible] = useState(false);
	const { setAuthenticated, setMember } = useGlobalStore();
	const navigate = useNavigate();
	const naverRef = useRef<HTMLDivElement>(null);
	const [message, setMessage] = useState("");

	useEffect(() => {
		const clientId = import.meta.env.VITE_NAVER_CLIENT_ID;
		const callbackUrl = import.meta.env.VITE_NAVER_REDIRECT_URI;
		const kakaoKey = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY;

		// Initialize Naver Login only if credentials are provided
		if (clientId && callbackUrl && naver) {
			try {
				const naverLogin = new naver.LoginWithNaverId({
					clientId,
					callbackUrl,
					callbackHandle: true,
					loginButton: { color: "green", type: 0, height: "44" },
				});
				naverLogin.init();
				naverLogin.logout();
			} catch (error) {
				console.warn('Naver login initialization failed:', error);
			}
		}

		// Initialize Kakao only if key is provided
		if (kakaoKey && Kakao && !Kakao.isInitialized()) {
			try {
				Kakao.init(kakaoKey);
			} catch (error) {
				console.warn('Kakao initialization failed:', error);
			}
		}

		setVisible(true);
	}, []);



	const defaultValues: LoginType = {
		user_id: "",
		password: ""
	};


	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<LoginType>({
		resolver: zodResolver(LoginSchema),
		defaultValues,
	});


	const handleNaverClick = () => {
		if (naverRef.current?.children[0] instanceof HTMLElement) {
			(naverRef.current.children[0] as HTMLElement).click();
		}
	};
	
	const KakaoLogin = () => {
		if (!window.Kakao || !window.Kakao.isInitialized()) {
			alert('카카오 로그인 서비스가 설정되지 않았습니다. 관리자에게 문의하세요.');
			return;
		}

		window.Kakao.Auth.login({
			success: async function (data) {
				AuthService.loginBySocial('kakao', data.access_token).then((data) => {

					if (data.state === "ok") {
						setMember(data.member);
						setAuthenticated(true);
						navigate('/');

					} else if (data.state === "register") {
						const stateData = { member_id: data.member.insertId };
						console.log(stateData);
						navigate('/auth/signup', { state: stateData });

					} else {
						navigate('/auth/login');
					}
				});
			},
			fail: function (data) {
				alert(data);
			}
		});
	}



	const onSubmit = async (data: LoginType) => {
		try {
			const response = await AuthService.login(data.user_id, encodeURIComponent(data.password));
			if (response.type === "error") {
				setMessage(response.message);
			// } else if (response.type === "password") {
			// 	alert('비밀번호를 재등록 해주세요.');
			// 	navigate("/auth/password");
			} else {
				setMember(response.member);
				setAuthenticated(true);
				setMessage('');
				navigate("/");
			}
		} catch (error) {
			setMessage("로그인 중 오류가 발생했습니다.");
		}
	};


	return (
		<div className={`vh-content-wrap ${visible && 'active'}`}>
			<div className="login">
				<div className="vw-inner">
					<h1>로그인</h1>
					<form onSubmit={handleSubmit(onSubmit)}>
						<span>이메일</span>
						<input
							type="text"
							{...register("user_id")}
						/>
						{errors.user_id && <p style={{ color: 'red' }}>{errors.user_id.message}</p>}

						<span>비밀번호</span>
						<input
							type="password"
							{...register("password")}
						/>
						{errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}
						{message && <div style={{ color: 'red', fontWeight: 400, fontSize: '14px' }}>{message}</div>}

						<button type="submit" className="btn-submit">로그인</button>
						<h2>SNS 계정으로 로그인하기</h2>
						<div className="btn_area">
							<button type="button" onClick={() => handleNaverClick()}><img src="/images/icon/btn/btn_naver.png" alt="" /></button>
							<button type="button" onClick={KakaoLogin}><img src="/images/icon/btn/btn_kakao.png" alt="" /></button>
						</div>
					</form>
					<div className="btn-join">
						<Link to="/auth/intro">계정이 없으신가요? 회원가입하기</Link>
					</div>
					<div className="link-area">
						<Link to="/auth/reset-password">아이디 찾기</Link> |
						<Link to="/auth/reset-password">비밀번호 찾기</Link>
					</div>
					<div ref={naverRef} id="naverIdLogin" style={{ display: 'none' }}></div>


				</div>
			</div>
		</div>

	);
}



export default Login;
