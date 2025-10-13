import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import useGlobalStore from '@/stores/globalStore';
import AuthService from '@/services/AuthService';

function Header() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
	const location = useLocation();
	const { isAuthenticated } = useGlobalStore();
	const navigate = useNavigate();

	useEffect(() => {
		// 라우트 변경 시 모바일 메뉴와 하위 메뉴 모두 닫음
		setMobileMenuOpen(false);
		setOpenSubMenu(null);
	}, [location]);

	const toggleMobileMenu = () => {
		setMobileMenuOpen(!mobileMenuOpen);
	};

	const toggleSubMenu = (menu: string) => {
		setOpenSubMenu(prev => (prev === menu ? null : menu));
	};

	return (
		<div className="vh-header-wrap">
			<header id="header">
				<div className="header-inner vw-inner">
					<div className="header-logo">
						<Link to="/">
							<img src="/images/logo/top_logo2.png" alt="로고" />
						</Link>
					</div>
					<div className={`header-menu ${mobileMenuOpen ? 'active' : ''}`}>
						<ul>
							<li>
								<Link to="/">소개</Link>
							</li>
							<li>
								<Link to="/prepare">수업준비</Link>
							</li>
							<li>
								<Link to="/apply">수강신청</Link>
							</li>
							<li>
								{isMobile ? (
									// 모바일에서는 Q&A 항목 클릭 시 하위 메뉴 토글
									<span className="menu-parent" onClick={() => toggleSubMenu('qna')}>
										Q&A &nbsp; <i className="fas fa-angle-right"></i>
									</span>
								) : (
									<Link to="">Q&A</Link>
								)}
								<ul style={{ display: isMobile && (openSubMenu === 'qna' ? 'block' : 'none') as any}}>
									<li>
										<Link to="/board/notice/list">공지사항 <i className="fas fa-angle-right"></i></Link>
									</li>
									<li>
										<Link to="/board/faq/list">자주묻는질문 <i className="fas fa-angle-right"></i></Link>
									</li>
									<li>
										<Link to="/board/review/list">수강후기 <i className="fas fa-angle-right"></i></Link>
									</li>
								</ul>
							</li>
							<li>
								{isMobile ? (
									<span className="menu-parent" onClick={() => toggleSubMenu('mypage')}>
										마이페이지 &nbsp; <i className="fas fa-angle-right"></i>
									</span>
								) : (
									<Link to="">마이페이지</Link>
								)}
								<ul style={{ display: isMobile && (openSubMenu === 'mypage' ? 'block' : 'none') as any}}>
									<li>
										<Link to="/mypage/payments">결제내역 <i className="fas fa-angle-right"></i></Link>
									</li>
									<li>
										<Link to="/mypage/classrooms">내 강의실 <i className="fas fa-angle-right"></i></Link>
									</li>
									<li>
										<Link to="/mypage/profile">회원정보수정 <i className="fas fa-angle-right"></i></Link>
									</li>
								</ul>
							</li>
							<li>
								<a href="https://smartstore.naver.com/tamburinmusic" target="_blank" rel="noreferrer">
									온라인몰
								</a>
							</li>
						</ul>
						{/* 모바일용 닫기 버튼 */}
						<button className="mobile-menu-close" onClick={toggleMobileMenu}>
							<i className="fas fa-times"></i>
						</button>
					</div>
					<div className="header-button">
						<div className="btn_area">
							{
								isAuthenticated ? (
									<>
										<button type="button" onClick={() => {
											AuthService.clearLocalCredential();
											navigate('/');
										}}>로그아웃</button>
									</>
								) : (
									<>
										<Link to="/auth/login">로그인</Link>
										<Link to="/auth/intro">회원가입</Link>
									</>
								)
							}

							{/* 모바일용 햄버거 버튼 */}
							<button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
								<i className="fas fa-bars"></i>
							</button>
						</div>
					</div>
				</div>
			</header>
		</div>
	);
}

export default Header;
