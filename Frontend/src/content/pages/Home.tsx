import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { isMobile } from 'react-device-detect';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Popup } from '@/models/popup';
import { Banner } from '@/models/banner';
import { Meta } from '@/models/meta';

import BannerService from '@/services/BannerService';
import MetaService from '@/services/MetaService';
import PopupService from '@/services/PopupService';

import * as CONFIG from '@/config';

function Home() {
	const [visible, setVisible] = useState(false);
	const [isFooterVisible, setIsFooterVisible] = useState(false);
	const [popupList, setPopupList] = useState<Popup[]>([]);
	const [bannerList1, setBannerList1] = useState<Banner[]>([]);
	const [bannerList2, setBannerList2] = useState<Banner[]>([]);
	const [bannerList3, setBannerList3] = useState<Banner[]>([]);
	const [visualImagePc, setVisualImagePc] = useState<string>('');
	const [visualImageMobile, setVisualImageMobile] = useState<string>('');
	const [homeVideo, setHomeVideo] = useState<string>('');

	const handleScroll = () => setIsFooterVisible(window.scrollY >= 100);

	// 오늘 하루 보지 않기 상태 확인
	const isPopupHiddenToday = (popupId: number) => {
		const hiddenPopups = JSON.parse(localStorage.getItem('hiddenPopups') || '{}');
		const hiddenUntil = hiddenPopups[popupId];
		return hiddenUntil && new Date(hiddenUntil) > new Date();
	};

	// 팝업 닫기
	const handleClose = (popupId: number) => {
		setPopupList((prev) => prev.filter((p) => p.id !== popupId));
	};

	// 오늘 하루 보지 않기
	const handleHideToday = (popupId: number) => {
		const midnight = new Date();
		midnight.setHours(23, 59, 59, 999);
		const hiddenPopups = JSON.parse(localStorage.getItem('hiddenPopups') || '{}');
		hiddenPopups[popupId] = midnight.toISOString();
		localStorage.setItem('hiddenPopups', JSON.stringify(hiddenPopups));
		handleClose(popupId);
	};



	async function loadInitialData() {
		// 배너 로드
		const banner1: Banner[] = await BannerService.getByEntityType('banner1');
		const banner2: Banner[] = await BannerService.getByEntityType('banner2');
		const banner3: Banner[] = await BannerService.getByEntityType('banner3');
		if (banner1) {
			for (const row of banner1) {
				const cleanedText = row.additional_text.replace(/[\n\r]/g, "\\n");
				row.parse_text = JSON.parse(cleanedText);
			}
		}
		if (banner2) {
			for (const row of banner2) {
				const cleanedText = row.additional_text.replace(/[\n\r]/g, "\\n");
				row.parse_text = JSON.parse(cleanedText);
			}
		}
		if (banner3) {
			for (const row of banner3) {
				const cleanedText = row.additional_text.replace(/[\n\r]/g, "\\n");
				row.parse_text = JSON.parse(cleanedText);
			}
		}
		setBannerList1(banner1);
		setBannerList2(banner2);
		setBannerList3(banner3);

		// 홈 이미지, 비디오파일 로드
		const settingsBanner: Meta[] = await MetaService.getList('settingsBanner');
		const settingsVideo: Meta[] = await MetaService.getList('settingsVideo');
		if (settingsBanner) {
			setVisualImagePc(settingsBanner.filter(row => row.entity_id == "10").map(row => row.entity_value)[0] || '');
			setVisualImageMobile(settingsBanner.filter(row => row.entity_id == "20").map(row => row.entity_value)[0] || '');
			setHomeVideo(settingsVideo.filter(row => row.entity_id == "10").map(row => row.entity_value)[0] || '');
		}

		// 팝업 데이터 로드
		const popup: Popup[] = await PopupService.getToday();
		if (popup) {
			const filteredPopups = popup.filter((p) => !isPopupHiddenToday(p?.id ?? 0));
			setPopupList(filteredPopups);
		}


		setVisible(true);
	}

	useEffect(() => {
		loadInitialData();

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);



	return (
		<div className={`vh-content-wrap ${visible && 'active'}`}>

			{/* 팝업 오버레이 및 팝업 리스트 */}
			{popupList.length > 0 && (
				<>
					<div
						style={{
							position: 'fixed',
							top: 0,
							left: 0,
							width: '100%',
							height: '100%',
							background: 'rgba(0, 0, 0, 0.5)',
							zIndex: 999,
						}}
					/>
					{popupList.map((popup, index) => (
						<div style={{
							position: 'fixed',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
							width: '400px',
							maxHeight: '80vh',
							overflowY: 'auto',
							zIndex: 1000 + index, // 순서대로 겹침
						}}>
							<div
								key={`popup-${popup.id}`}
								style={{
									background: '#fff',
									borderRadius: '8px',
									boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
									padding: '32px 24px',
									textAlign: 'center',
								}}
							>
								{popup.name && ( <h2 style={{ fontSize: '18px', fontWeight: 500 }}>{popup.name}</h2> )}
								{popup.content && ( <p style={{ padding: '16px 0 0', fontSize: '14px', color: '222222', textAlign: 'left', marginBottom: '20px' }}>{popup.content}</p> )}
								{popup.image_file && <img src={popup.image_file} alt={popup.name} style={{ maxWidth: '100%' }} />}
								{popup.button_label && (
									<a href={popup.link_url} style={{
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										marginTop: '10px',
										background: '#008cff',
										color: '#FFF',
										width: '100%',
										padding: '0 24px',
										height: '42px',
										fontSize: '14px',
										fontWeight: '500',
										borderRadius: '10px'
									}}>{popup.button_label}</a>)}
							</div>
							<div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '0 8px' }}>
								<button
									onClick={() => handleHideToday(popup?.id ?? 0)}
									style={{ marginTop: '10px', background: 'transparent', borderBottom: '2px solid white', fontSize: '16px', color: '#fff' }}
								>
									오늘 하루 보지 않기
								</button>
								<button
									onClick={() => handleClose(popup?.id ?? 0)}
									style={{ marginTop: '10px', background: 'transparent', borderBottom: '2px solid white', fontSize: '16px', color: '#fff' }}
								>
									닫기
								</button>
							</div>
						</div>
					))}
				</>
			)
			}

			<div className="home-visual-cont">
				<Link to="/apply">
					{isMobile ? (
						<img src={visualImageMobile} alt="" />
					) : (
						<img src={visualImagePc} alt="" />
					)}
				</Link>
			</div>

			<div className="home-section">
				<div className="vw-inner">
					<h1 className="title"><strong>음악의 첫걸음,</strong><br />
						탬버린 뮤직에서 시작해보세요</h1>
					<h2 className="sub-title">탬버린 뮤직은 한예종,서울대 등 국내외 명문 음대 선생님과의 1:1 악기 레슨 서비스를 제공합니다.<br />
						레슨, 악기, 교재 등 악기에 필요한 모든 것을 한번에 드리는 온라인 레슨 서비스입니다.</h2>
				</div>
				<div className="home-teacher-slide swiper-type-01">
					{bannerList1.length > 0 && (
						<Swiper
							modules={[Navigation, Pagination, Autoplay]}
							loop={true}
							autoplay={{
								delay: 3000,
								disableOnInteraction: false,
							}}
							navigation={{
								prevEl: '.swiper-button-custom-prev',
								nextEl: '.swiper-button-custom-next',
							}}
							pagination={{
								type: 'fraction',
								el: '.swiper-number-pagination',
							}}
							breakpoints={{
								// 모바일 (최소 320px 이상)
								320: {
									slidesPerView: 2,
									spaceBetween: 10,
								},
								// 태블릿 (768px 이상)
								768: {
									slidesPerView: 2,
									spaceBetween: 20,
								},
								// PC (1024px 이상)
								1024: {
									slidesPerView: 'auto',
									spaceBetween: 30,
								},
							}}
						>
							{bannerList1.map((row) => (
								<SwiperSlide key={`1-${row.id}`}>
									<div className="box">
										<a href={row.parse_text?.text5} target="_blank">
											<img src={row.image_file} alt="" />
										</a>
										<div className="text-cont">
											<h1>
												{row.parse_text?.text1}
												<br />
												{row.parse_text?.text2}
											</h1>
											<h2>{row.parse_text?.text3}</h2>
											<p>{row.parse_text?.text4}</p>
											<div className="devide"></div>
											<a href={row.parse_text?.text5} target="_blank">더보기</a>
										</div>
									</div>

								</SwiperSlide>
							))}
							<div className="plugin_cont">
								<div className="swiper-number-pagination">
									<div className="swiper-pagination-current"></div>
									<div className="swiper-pagination-total"></div>
								</div>
								<div className="swiper-button-custom-prev"><img src="/images/icon/btn/slide_left.png" alt="" /></div>
								<div className="swiper-button-custom-next"><img src="/images/icon/btn/slide_right.png" alt="" /></div>
							</div>
						</Swiper>
					)}
				</div>
			</div>


			<div className="home-section">
				<div className="vw-inner">
					<h1 className="title"><strong>악기 연주에 필요한,</strong><br />
						모든 것이 탬버린 뮤직 한 곳에!</h1>
					<h2 className="sub-title">첫 연주, 그 감동의 순간부터 나의 평생 취미가 생길때까지,<br />
						실력 성장 단계에 필요한 악기, 교재, 선생님, 피드백등 모든 것을 지원합니다.</h2>

					<div className="home-intro">
						<ul>
							<li>
								<img src="/images/banner/home/banner1_01.png" alt="" />
							</li>
							<li>
								<img src="/images/banner/home/banner1_02.png" alt="" />
							</li>
							<li>
								<img src="/images/banner/home/banner1_03.png" alt="" />
							</li>
							<li>
								<img src="/images/banner/home/banner1_06.png" alt="" />
							</li>
							<li>
								<img src="/images/banner/home/banner1_05.png" alt="" />
							</li>
							<li>
								<img src="/images/banner/home/banner1_04.png" alt="" />
							</li>
						</ul>
					</div>
				</div>
			</div>


			<div className="home-section">
				<div className="vw-inner">
					<h1 className="title"><strong>온라인 레슨이 어색하시다구요?</strong><br />
						수업 영상을 확인해보세요.</h1>
					<h2 className="sub-title">꼼꼼히 따져볼수록 장점이 가득한 온라인 레슨.<br />
						실력 성장 단계에 필요한 악기, 교재, 선생님, 피드백등 모든 것을 지원합니다.</h2>

					<div className="home-video-section">
						<div className="video-cont">
							{homeVideo && (
								<video height="100%" width="100%" muted loop autoPlay playsInline>
									<source src={homeVideo} type="video/mp4" />
								</video>
							)}
						</div>
						<img src="/images/banner/home/banner_table.png" alt="" />
					</div>
				</div>
			</div>



			<div className="home-section yellow-section">
				<div className="vw-inner">
					<h3 className="caption">탬버린 구성품</h3>
					<h1 className="title"><strong>악기 둘러보기</strong></h1>
					<h2 className="sub-title2">악기가 없다면 탬버린 뮤직에서<br />
						제공하는 악기로 부담없이 시작해보세요.</h2>
				</div>
				<div className="home-instrument-slide swiper-type-01">
					{bannerList2.length > 0 && (
						<Swiper
							modules={[Navigation, Pagination, Autoplay]}
							loop={true}
							autoplay={{
								delay: 3000,
								disableOnInteraction: false,
							}}
							navigation={{
								prevEl: '.swiper-button-custom-prev2',
								nextEl: '.swiper-button-custom-next2',
							}}
							pagination={{
								type: 'fraction',
								el: '.swiper-number-pagination2',
							}}
							breakpoints={{
								// 모바일 (최소 320px 이상)
								320: {
									slidesPerView: 2,
									spaceBetween: 10,
								},
								// 태블릿 (768px 이상)
								768: {
									slidesPerView: 2,
									spaceBetween: 20,
								},
								// PC (1024px 이상)
								1024: {
									slidesPerView: 'auto',
									spaceBetween: 30,
								},
							}}
						>
							{bannerList2.map((row) => (
								<SwiperSlide key={`2-${row.id}`}>
									<a href={row.parse_text?.text1} target="_blank">
										<div className="box">
											<img src={row.image_file} alt="" key={row.id} />
										</div>
									</a>
								</SwiperSlide>
							))}
							<div className="plugin_cont">
								<div className="swiper-number-pagination2">
									<div className="swiper-pagination-current"></div>
									<div className="swiper-pagination-total"></div>
								</div>
								<div className="swiper-button-custom-prev2"><img src="/images/icon/btn/slide_left.png" alt="" /></div>
								<div className="swiper-button-custom-next2"><img src="/images/icon/btn/slide_right.png" alt="" /></div>
							</div>
						</Swiper>
					)}
				</div>
			</div>


			<div className="home-section">
				<div className="vw-inner">
					<h3 className="caption">탬버린 구성품</h3>
					<h1 className="title"><strong>교재 & 반주 MR</strong></h1>
					<h2 className="sub-title2">이론을 배우지 않아도 자연스럽게 <br />
						이론을 익히며 실기를 배울 수 있는 교재와 반주 MR이 제공됩니다.</h2>
					<div className="text-list">
						<p><img src="/images/icon/common/text-icon.png" alt="" /> QR코드를 스캔하면 속도에 맞게 반주 MR을 들을 수 있습니다. </p>
						<p><img src="/images/icon/common/text-icon.png" alt="" />  교재는 PDF파일로 제공됩니다. </p>
					</div>

					<div className="home-books">
						<div className="img-cont">
							<img src="/images/banner/home/banner2_01.png" alt="" />
							<img src="/images/banner/home/banner2_02.png" alt="" />
						</div>
					</div>
				</div>
			</div>

			<div className="home-section yellow-section">
				<div className="vw-inner">
					<h3 className="caption">탬버린 이용방법</h3>
					<h1 className="title"><strong>탬버린 수강방법</strong></h1>
					<h2 className="sub-title2">레슨 선생님부터 악기, 교재, MR이 모두 한번에 준비됩니다.<br />
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


			<div className="home-section section-review">
				<div className="vw-inner">
					<h1 className="title"><strong>탬버린 뮤직 수강생들의<br />
						리얼 리뷰 후기</strong></h1>

					<div className="home-review-slide">
						<div className="swiper-button-custom-prev3"><img src="/images/icon/btn/slide_left.png" alt="" /></div>
						<div className="swiper-button-custom-next3"><img src="/images/icon/btn/slide_right.png" alt="" /></div>
						<Swiper
							modules={[Navigation, Pagination, Autoplay]}
							loop={true}
							// autoplay={{
							// 	delay: 3000,
							// 	disableOnInteraction: false,
							// }}
							navigation={{
								prevEl: '.swiper-button-custom-prev3',
								nextEl: '.swiper-button-custom-next3',
							}}
							breakpoints={{
								// 모바일 (최소 320px 이상)
								320: {
									slidesPerView: 2,
									spaceBetween: 20,
								},
								// 태블릿 (768px 이상)
								768: {
									slidesPerView: 2,
									spaceBetween: 20,
								},
								// PC (1024px 이상)
								1024: {
									slidesPerView: 3,
									spaceBetween: 10,
								},
							}}
						>
							{bannerList3.map((row) => (
								<SwiperSlide key={`3-${row.id}`}>
									<a href={row.parse_text?.text4} target="_blank">
										<div className="box">
											<img src={row.image_file} alt="" />
											<div className="text-cont">
												<img src="/images/icon/common/review.png" alt="" />
												<h1>{row.parse_text?.text1}</h1>
												<h2>{row.parse_text?.text3}</h2>
												<p>{row.parse_text?.text2}</p>
											</div>
										</div>
									</a>
								</SwiperSlide>
							))}
						</Swiper>
					</div>
				</div>
			</div>

			<div className="section-devide"></div>


			<div className="home-section">
				<div className="vw-inner">
					<h1 className="title"><strong>탬버린 뮤직이 더 궁금하시다면 <br />
						문의해주세요</strong></h1>

					<div className="home-contact">
						<div className="btn_area">
							<a href="tel:1533-7430">고객 센터  1533-7430</a>
							<a href="http://pf.kakao.com/_UPqrb" target="_blank">카카오톡  @탬버린 뮤직</a>
						</div>

					</div>

				</div>
			</div>

			{
				isFooterVisible && (
					<div className="side-payment-button">
						<Link to='/apply'>수강신청 바로가기</Link>
					</div>
				)
			}

		</div >
	);
}

export default Home;
