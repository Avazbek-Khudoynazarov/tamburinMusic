import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { isMobile } from 'react-device-detect';

function Prepare() {
	const [visible, setVisible] = useState(false);
	const [activeTab, setActiveTab] = useState('tab1');

	useEffect(() => {
		setVisible(true);
	}, []);

	return (
		<div className={`vh-content-wrap ${visible && 'active'}`}>

			<div className="prepare">

				<h1 className="title">수업 준비</h1>

				<div className="tabs">
					<button
						onClick={() => setActiveTab('tab1')}
						className={activeTab === 'tab1' ? 'active' : ''}
					>
						수업 준비 사항
					</button>
					<button
						onClick={() => setActiveTab('tab2')}
						className={activeTab === 'tab2' ? 'active' : ''}
					>
						수업 진행
					</button>
					<button
						onClick={() => setActiveTab('tab3')}
						className={activeTab === 'tab3' ? 'active' : ''}
					>
						Zoom 설치
					</button>
				</div>

				<div className="tab-content">

					{activeTab === 'tab1' &&
						<div className="tab1">
							<div className="vw-inner">
								<h1>수업 준비 사항</h1>
								<ul>
									<li>
										<h1>1</h1>
										<h2>수강신청</h2>
										<Link to="/apply" className="active">수강 신청 하러가기</Link>
									</li>
									<li>
										<h1>2</h1>
										<h2>Zoom 설치</h2>
										<a href="https://zoom.us/download#client_4meeting" target="_blank">Zoom 설치 하러가기</a>
									</li>
								</ul>
							</div>
						</div>
					}

					{activeTab === 'tab2' &&
						<div className="tab2">
							<div className="vw-inner">
								<h1>수업 진행</h1>
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
					}

					{activeTab === 'tab3' &&
						<div className="tab3">
							<div className="vw-inner">
								<h1>Zoom 설치 가이드</h1>

								<ul className="install">
									<li>
										<h1>PC 버전 Zoom 다운로드</h1>
										<a href="https://zoom.us/download#client_4meeting" target="_blank">
											<span>Zoom 다운로드</span>
										</a>
									</li>
									<li>
										<h1>모바일 버전 Zoom 다운로드</h1>
										<a href="https://apps.apple.com/us/app/id546505307" target="_blank">
											<img src="/images/icon/btn/apple_store.png" alt="" />
										</a>
										<a href="https://play.google.com/store/apps/details?id=us.zoom.videomeetings" target="_blank">
											<img src="/images/icon/btn/google_store.png" alt="" />
										</a>
									</li>
								</ul>
							</div>

							<div className="guide-cont">
								<div className="vw-inner">
									<ul className="guide">
										<li>
											<div className="txt-cont">
												<span className="no">1</span>
												<span className="txt">컴퓨터 사양에 맞추어(32비트/64비트) Zoom을 다운로드 하고 설치를 합니다.</span>
												<div className="img-cont">
													<img src="/images/banner/prepare/banner_01.jpg" alt="" />
												</div>
												<p>※ 별도의 Zoom 회원가입 또는 로그인없이 수업에 참여하실 수 있습니다.</p>
											</div>
										</li>
										<li>
											<div className="txt-cont">
												<span className="no">2</span>
												<span className="txt">'마이페이지' - '내 강의실'의 수업스케쥴 캘린더에서 나의 수업을 선택하여 강의실로 이동합니다.</span>
												<div className="img-cont">
													<img src="/images/banner/prepare/banner_02.jpg" alt="" />
												</div>
											</div>
										</li>
										<li>
											<div className="txt-cont">
												<span className="no">3</span>
												<span className="txt">강의실에서 [Zoom 입장하기] 버튼을 클릭하면 Zoom 강의실로 접속이 됩니다.</span>
												<div className="img-cont">
													<img src="/images/banner/prepare/banner_03.jpg" alt="" />
												</div>
												<p>※ Zoom 강의실에 입장 요청 하시면 수업 시간에 맞추어 입장이 허가됩니다.</p>
											</div>
										</li>
										<li>
											<div className="txt-cont">
												<span className="no">4</span>
												<span className="txt">Zoom 강의실이 연결된 후 아래와 같이 창이 열리면 'Zoom 열기' 버튼을 클릭합니다.</span>
												<div className="img-cont">
													<img src="/images/banner/prepare/banner_04.jpg" alt="" />
												</div>
											</div>
										</li>
										<li>
											<div className="txt-cont">
												<span className="no">5</span>
												<span className="txt">튜터가 수강생의 정보를 확인하고 승인을 하는 중입니다.</span>
												<div className="img-cont">
													<img src="/images/banner/prepare/banner_05.jpg" alt="" />
												</div>
												<p>※ 수업 시간이 시작되고 5분이 경과하였는데, 튜터의 승인이 없으면 수업 요청을 닫고
													고객센터 연락주세요.</p>
											</div>
										</li>
										<li>
											<div className="txt-cont">
												<span className="no">6</span>
												<span className="txt">Zoom 강의실에 입장하면, 스피커 &amp; 마이크 테스트를 진행하실 수 있습니다.</span>
												<div className="img-cont">
													<img src="/images/banner/prepare/banner_06.jpg" alt="" />
												</div>
											</div>
										</li>
										<li>
											<div className="txt-cont">
												<span className="no doub">6-1</span>
												<span className="txt">스피커 테스트.</span>
												<div className="img-cont">
													<img src="/images/banner/prepare/banner_07.jpg" alt="" />
												</div>
											</div>
										</li>
										<li>
											<div className="txt-cont">
												<span className="no doub">6-2</span>
												<span className="txt">마이크 테스트.</span>
												<div className="img-cont">
													<img src="/images/banner/prepare/banner_08.jpg" alt="" />
												</div>
											</div>
										</li>
										<li>
											<div className="txt-cont">
												<span className="no doub">6-3</span>
												<span className="txt">테스트 완료.</span>
												<div className="img-cont">
													<img src="/images/banner/prepare/banner_09.jpg" alt="" />
												</div>
											</div>
										</li>
										<li>
											<div className="txt-cont">
												<span className="no">7</span>
												<span className="txt">왼쪽 하단에 마이크와 비디오를 확인하세요.</span>
												<div className="img-cont">
													<img src="/images/banner/prepare/banner_10.jpg" alt="" />
												</div>
												<p>※ Zoom 사용이 어렵거나 문의가 있다면 언제든 탬버린 뮤직 카카오톡 문의로 연락주세요.</p>
											</div>
										</li>
										<li>
											<div className="txt-cont">
												<span className="no">8</span>
												<span className="txt">수업 준비가 완료 되었습니다.</span>
												<div className="img-cont">
													<img src="/images/banner/prepare/banner_11.jpg" alt="" />
												</div>
												<p>※ Zoom 화면 및 강의실의 크기는 언제든 조정이 가능하니, 보기 편한 크기로 설정하여
													수업을 들으실 수 있습니다.</p>
											</div>
										</li>
									</ul>
								</div>
							</div>


						</div>
					}
				</div>
			</div>
		</div >
	);
}

export default Prepare;
