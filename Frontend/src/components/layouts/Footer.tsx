import React from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Footer() {

	const location = useLocation();
	const extraPadding = location.pathname === '/' ? '80px' : '60px';

	return (
		<div className="vh-footer-wrap">
			<footer id="footer" style={{ paddingBottom: extraPadding }}>
				<div className="vw-inner">
					<div className="footer-company-info">
						<p>(주)음악앤</p>
						<dl>
							<dd>대표 : 안왕식</dd>
							<dd>사업자번호 : 510-08-19813</dd>
							<dd>주소 : 안산시 상록구 도매시장로2길 37, 102호(이동)</dd>
						</dl>
						<dl>
							<dd>통신판매업신고 : 2022-경기안산-0671</dd>
							<dd>학원설립 운영등록번호 : 제4648 탬버린뮤직원격학원(원격) 정보조회</dd>
						</dl>
						<dl>
							<dd>신고기관명 : 안산교육지원청</dd>
						</dl>
					</div>
					<div className="footer-gnb-wrap">
						<ul className="footer-gnb">
							<li><Link to='/auth/agreement'>이용약관</Link></li>
							<li><Link to='/auth/privacyPolicy'>개인정보보호정책</Link></li>
							<li><Link to='/auth/refund'>환불규정</Link></li>
						</ul>
					</div>
					<div className="footer-copyright">
						<p>Copyright © 2022 Tamburin Music All rights Reserved.</p>
					</div>
					<ul className="footer-social">
						<li>
							<a href="https://www.instagram.com/tamburin_music/" target="_blank">
								<img src="/images/icon/btn/btn_insta.png" alt="" data-no-retina="" />
							</a>
						</li>
						<li>
							<a href="https://www.youtube.com/channel/UCN2etK5cLnQd-QPtfa-6pPw" target="_blank">
								<img src="/images/icon/btn/btn_youtube.png" alt="" data-no-retina="" />
							</a>
						</li>
					</ul>
				</div>
			</footer>
			<div className="side-social">
				<a href="https://pf.kakao.com/_UPqrb" target="_blank">
					<img src="/images/icon/btn/btn_kakao.png" alt="" />
				</a>
			</div>
		</div>
	);
}

export default Footer;
