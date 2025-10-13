import './global.css';
import '@/components/UI/Minimal/assets/css/fonts.css'; // 폰트 정의 파일 로드
import '@/components/UI/Minimal/assets/css/custom.css'; // 관리자 공통 스타일

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LocalizationProvider } from '@/components/UI/Minimal/locales';
import { I18nProvider } from '@/components/UI/Minimal/locales/i18n-provider';
import { ThemeProvider } from '@/components/UI/Minimal/theme/theme-provider';
import { HelmetProvider } from 'react-helmet-async';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';

import Home from '@/content/pages/Home';
import Prepare from '@/content/pages/Prepare';
import Apply from '@/content/pages/Apply';
import Payment from '@/content/pages/Payment';
import NotFound from '@/content/pages/NotFound';

import BoardList from '@/content/pages/board/BoardList';
import BoardListFaq from '@/content/pages/board/BoardListFaq';
import BoardCreate from '@/content/pages/board/BoardCreate';
import BoardEdit from '@/content/pages/board/BoardEdit';
import BoardView from '@/content/pages/board/BoardView';

import PaymentHistory from '@/content/pages/mypage/PaymentHistory';
import Classrooms from '@/content/pages/mypage/Classrooms';
import ClassroomDetail from '@/content/pages/mypage/ClassroomDetail';
import ClassBoardCreate from '@/content/pages/mypage/ClassBoardCreate';
import ClassBoardEdit from '@/content/pages/mypage/ClassBoardEdit';
import ClassBoardView from '@/content/pages/mypage/ClassBoardView';
import ProfileEdit from '@/content/pages/mypage/ProfileEdit';

import Intro from '@/content/pages/auth/Intro';
import Login from '@/content/pages/auth/Login';
import Admin from '@/content/pages/auth/Admin';
import Signup from '@/content/pages/auth/Signup';
import ResetPassword from '@/content/pages/auth/ResetPassword';
import Password from '@/content/pages/auth/Password';
import Redirect from '@/content/pages/auth/Redirect';
import Agreement from '@/content/pages/auth/Agreement';
import PrivacyPolicy from '@/content/pages/auth/PrivacyPolicy';
import Refund from '@/content/pages/auth/Refund';

import useGlobalStore from '@/stores/globalStore';

import { SettingsDrawer, defaultSettings, SettingsProvider } from '@/components/UI/Minimal/components/settings';
import ProtectedRoute from './ProtectedRoute';

const App = () => {
	const { isAuthenticated } = useGlobalStore();

	console.log(isAuthenticated);

	return (
		<HelmetProvider>
			<BrowserRouter>
				<I18nProvider>
					<LocalizationProvider>
						<SettingsProvider settings={defaultSettings}>
							<ThemeProvider>

								<Header />
								<Routes>
									<Route path="/" element={<Home />} />
									<Route path="/prepare" element={<Prepare />} />
									<Route path="/apply" element={<Apply />} />
									<Route path="/payment/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
										<Route index element={<Payment />} />
									</Route>

									<Route path="/prepare" element={<Prepare />} />
									<Route path="/apply" element={<Apply />} />
									<Route path="/payment" element={<Payment />} />

									<Route path="/board">
										<Route path=":type/list" element={<BoardList />} />
										<Route path="faq/list" element={<BoardListFaq />} />
										<Route path=":id" element={<BoardView />} />
										<Route path=":type/new" element={<ProtectedRoute isAuthenticated={isAuthenticated} />} >
											<Route index element={<BoardCreate />} />
										</Route>
										<Route path="edit/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated} />} >
											<Route index element={<BoardEdit />} />
										</Route>
									</Route>

									<Route path="/mypage" element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
										<Route path="payments" element={<PaymentHistory />} />
										<Route path="classrooms">
											<Route index element={<Classrooms />} />
											<Route path=":id" element={<ClassroomDetail />} />
										</Route>
										<Route path="board">
											<Route path="new/:id" element={<ClassBoardCreate />} />
											<Route path="edit/:id" element={<ClassBoardEdit />} />
											<Route path=":id" element={<ClassBoardView />} />
										</Route>
										<Route path="profile" element={<ProfileEdit />} />
									</Route>

									<Route path="/auth">
										<Route path="kakao/callback" element={<Redirect />} />
										<Route path="naver/callback" element={<Redirect />} />

										<Route path="intro" element={<Intro />} />
										<Route path="login" element={<Login />} />
										<Route path="admin/:user_id" element={<Admin />} />
										<Route path="signup" element={<Signup />} />
										<Route path="reset-password" element={<ResetPassword />} />
										<Route path="password" element={<Password />} />
										<Route path="agreement" element={<Agreement />} />
										<Route path="privacyPolicy" element={<PrivacyPolicy />} />
										<Route path="refund" element={<Refund />} />
									</Route>

									<Route path="*" element={<NotFound />} />
								</Routes>
								<Footer />

							</ThemeProvider>
						</SettingsProvider>
					</LocalizationProvider>
				</I18nProvider>
			</BrowserRouter>
		</HelmetProvider>


	);
};


export default App;
