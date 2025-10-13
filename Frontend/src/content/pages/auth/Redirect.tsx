import { useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import useGlobalStore from '@/stores/globalStore';
import AuthService from '@/services/AuthService';

function Redirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuthenticated, setMember } = useGlobalStore();

  useEffect(() => {
    const socialType = location.pathname.includes('kakao') ? 'kakao' : 'naver';
    let code: string = '';
    
    if(socialType === 'kakao') {
      const searchParams = new URLSearchParams(location.search);
      code = searchParams.get('code')!;
    } else {
      const location = window.location.href.split('=')[1];
      try{
        code = location.split('&')[0];
      }catch(err) {
      }
    }
    
    if (code) {
      AuthService.loginBySocial(socialType, code).then((data) => {
        if (data.state === "ok") {
					setMember(data.member);
					setAuthenticated(true);
					navigate('/');

				} else if (data.state === "register") {
					const stateData = { member_id: data.member.insertId };
					navigate('/auth/signup', { state: stateData });

				} else {
					navigate('/auth/login');
				}
        
      });
    } else {
      navigate('/auth/login');
    }
  }, [navigate, location]);

  return (
		<>
		</>
    // <div>
    //   로그인 처리중...
    // </div>
  );
}

export default Redirect;
