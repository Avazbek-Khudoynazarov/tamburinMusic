import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import useGlobalStore from '@/stores/globalStore';
import AuthService from '@/services/AuthService';

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




function Intro() {
	const [visible, setVisible] = useState(false);
	const { setAuthenticated, setMember } = useGlobalStore();
	const navigate = useNavigate();
	const naverRef = useRef<HTMLDivElement>(null);
	const [message, setMessage] = useState("");

	useEffect(() => {
		const clientId = import.meta.env.VITE_NAVER_CLIENT_ID;
		const callbackUrl = import.meta.env.VITE_NAVER_REDIRECT_URI;

		const initializeNaverLogin = () => {
			const naverLogin = new naver.LoginWithNaverId({
				clientId,
				callbackUrl,
				callbackHandle: true,
				loginButton: { color: "green", type: 0, height: "44" },
			});
			naverLogin.init();
			naverLogin.logout();
		};
		initializeNaverLogin();

		if (!Kakao.isInitialized()) {
			Kakao.init(import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY);
		}

		setVisible(true);
	}, []);





	const KakaoLogin = () => {
		window.Kakao.Auth.login({
			success: async function (data) {
				AuthService.loginBySocial('kakao', data.access_token).then((data) => {

					if (data.state === "ok") {
						setMember(data.member);
						setAuthenticated(true);
						navigate('/');

					} else if (data.state === "register") {
						const stateData = { member_id: data.member.id };
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

	const handleNaverClick = () => {
		if (naverRef.current?.children[0] instanceof HTMLElement) {
			(naverRef.current.children[0] as HTMLElement).click();
		}
	};

	return (
		<div className={`vh-content-wrap ${visible && 'active'}`}>
			<div className="intro">
				<div className="vw-inner">
					<h1>3초안에 가입하고.<br />
						편안한 레슨을 경험해보세요 !</h1>
					<ul>
						<li>
							<button type="button" className="btn-naver" onClick={() => handleNaverClick()}><img src="/images/icon/common/naver.png" alt="" /> 네이버 간편 가입하기</button>
						</li>
						<li>
							<button type="button" className="btn-kakao" onClick={KakaoLogin}><img src="/images/icon/common/kakao.png" alt="" /> 카카오톡 간편 가입하기</button>
						</li>
						<li><div className="devide"></div></li>
						<li>
							<Link to="/auth/signup">
								<button type="button" className="btn-email">이메일로 가입하기</button>
							</Link>
						</li>
					</ul>
				</div>
			</div>
			<div ref={naverRef} id="naverIdLogin" style={{ display: 'none' }}></div>
		</div>

	);
}



export default Intro;
