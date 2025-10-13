import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

import { Payments } from '@/models/payments';
import { Classes } from '@/models/classes';
import { Member } from '@/models/member';
import { LiveChat } from '@/models/liveChat';
import { ClassesBoard } from '@/models/classesBoard';
import { Instrument } from '@/models/instrument';
import { Curriculum } from '@/models/curriculum';

import useGlobalStore from '@/stores/globalStore';
import PaymentsService from '@/services/PaymentsService';
import ClassesService from '@/services/ClassesService';
import MemberService from '@/services/MemberService';
import ClassesBoardService from '@/services/ClassesBoardService';
import { date } from 'zod';

function ClassroomDetail() {
	const [visible, setVisible] = useState(false);
	const { member } = useGlobalStore();
	const [classesList, setClassesList] = useState<Classes[]>([]);
	const [classesList2, setClassesList2] = useState<Classes[]>([]);
	const [classesRow, setClassesRow] = useState<Classes>();
	const [memberRow, setMemberRow] = useState<Member>();
	const [paymentsRow, setPaymentsRow] = useState<Payments>();
	const [classesBoardList, setClassesBoardList] = useState<ClassesBoard[]>([]);
	const [chatList, setChatList] = useState<LiveChat[]>([]);
	const [message, setMessage] = useState('');
	const [targetId, setTargetId] = useState<number>(0);
	const scrollRef = useRef<HTMLDivElement>(null);
	const navigate = useNavigate();
	const { id } = useParams();
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(10);

	async function loadInitialData() {
		const classes = await ClassesService.get(Number(id));
		if (classes) {
			const payments = await PaymentsService.get(classes.payments_id);
			const classList = await ClassesService.getByPaymentsId(classes.payments_id);
			if(member) {
				if(member.type === 10) {
					const list2 = classList.map(item => {
						const dateKST = new Date(item.classes_date); // 한국 시간 기준 (이미 KST로 세팅된 시간이라고 가정)
					
						// UTC로 계산된 시간을 브라우저 시간대로 보정
						const localDateStr = dateKST.toLocaleString('sv-SE', {
							timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // 사용자의 현재 타임존
							year: 'numeric',
							month: '2-digit',
							day: '2-digit',
							hour: '2-digit',
							minute: '2-digit',
							hour12: false
						});
					
						// 다시 Date 객체로 바꾸고 ISO 포맷으로 넣기 (원하는 형식에 따라 수정 가능)
						const localDate = new Date(localDateStr);
					
						return {
							...item,
							classes_date: localDate.toISOString() // or localDateStr for human-readable
						};
					});
					setClassesList(list2);
				} else {
					setClassesList(classList);
					setClassesList2(classList);
				}
			}
	
			
			setPaymentsRow(payments);
			setClassesRow(classes);
			setMemberRow(await MemberService.get(payments.member_id));

			// 채팅 데이터 불러오기
			let target_id = 0;
			// 
			if (payments?.member_id == member?.id && payments?.teacher_id) {
				target_id = payments?.teacher_id;
			} else if (member?.id == payments?.teacher_id) {
				target_id = payments?.member_id;
			}
			if (target_id !== 0) {
				setTargetId(target_id);
				const response = await MemberService.getLiveChatList(Number(target_id));
				if (response) {
					setChatList(response.liveChatList);
				}
			}



			if (payments?.member_id !== member?.id && payments?.teacher_id !== member?.id) {
				alert('접근 권한이 없습니다.');
				navigate(-1);
			}

			if(payments && payments?.member_id && payments?.teacher_id) {
				setClassesBoardList(await ClassesBoardService.getByMemberIdTeacherId(payments?.member_id, payments?.teacher_id));
			}


		} else {
			alert('잘못된 접근 입니다.');
			navigate(-1);
		}
		
		




		setVisible(true);
	}

	useEffect(() => {
		loadInitialData();
		connectSSE();
	}, []);

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [chatList]);




	const connectSSE = () => {
		const eventSource = new EventSource(`${import.meta.env.VITE_SSE_URL}/sse?token=${localStorage.getItem('token')}`,
			{
				withCredentials: false
			});

		eventSource.onmessage = (event) => {
			const newChat = JSON.parse(event.data)['liveChatList'];

			if (newChat.length > 0) {
				setChatList(prevChatList => {
					const filteredNewChat = newChat.filter(newItem =>
						!prevChatList.some(existingItem => existingItem.id === newItem.id)
					);
					if (filteredNewChat.length === 0) return prevChatList;

					return [...prevChatList, ...filteredNewChat];
				});
			}
		};

		eventSource.onopen = () => {
			console.log('SSE Connected');
		};

		eventSource.onerror = (error) => {
			console.error('SSE Error:', error);
			eventSource.close();
		};

		return () => {
			console.log('SSE Close');
			eventSource.close();
		};
	};



	const sendMessage = async () => {
		if (!message.trim()) return;

		try {
			//내가 학생인 경우 타겟 type은 teacher가 된다.
			const response = await MemberService.sendLiveChat(member?.type === 10 ? 'teacher' : 'member', Number(targetId), message);
			if (response) {
				setMessage('');
				//setChatList(prev => [...prev, newChat]);
			}
		} catch (error) {
			console.error('메시지 전송 실패:', error);
		}
	};


	const onSubmitClasses = async () => {
		try {

			if (!classesRow || !paymentsRow || !paymentsRow.id || !memberRow) {
				alert('필수 정보가 없습니다.');
				return;
			}
		

			// 수업 정보 수정
			const { payments:payments, member: member2, teacher: teacher2, curriculum: curriculum2, instrument: instrument2, ...payload2 } = classesRow;
			const result2 = await ClassesService.update(payload2);
			if (result2) {
				// alert('출석여부 정보 수정이 완료 되었습니다.');
			} else {
				alert('출석여부 정보 수정이 실패하였습니다');
			}

			
			// // 수업 스케쥴 리스트 수정
			// const payload3: Partial<Classes>[] = classesList.map(({ payments, member, teacher, curriculum, instrument, status, ...rest }) => ({
			// 	...rest,
			// 	classes_date: new Date(rest.classes_date!).toISOString()//dayjs(rest.classes_date).format('YYYY-MM-DD HH:mm:ss')
			// }));

			const originList = await ClassesService.getByPaymentsId(paymentsRow.id);

			// 오늘 날짜를 YYYY-MM-DD 문자열로 구함
			const todayStr = new Date().toISOString().slice(0, 10);

			let skipped = 0;

			const payload3: Partial<Classes>[] = classesList
				.filter((updatedRow) => {
					const originRow = originList.find(o => o.id === updatedRow.id);
					if (!originRow || !originRow.classes_date || !updatedRow.classes_date) return true;

					// const originDateStr = new Date(originRow.classes_date).toISOString().slice(0, 10);
					// const updatedDateStr = new Date(updatedRow.classes_date).toISOString().slice(0, 10);
					const originDateStr = new Date(new Date(originRow.classes_date).getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
					const updatedDateStr = new Date(new Date(updatedRow.classes_date).getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);


					// 오늘 날짜이면서 날짜를 변경했으면 제외 + count
					if (originDateStr === todayStr && originDateStr !== updatedDateStr) {
						skipped++;
						return false;
					}

					return true;
				})
				.map(({ payments, member, teacher, curriculum, instrument, status, ...rest }) => ({
					...rest,
					classes_date: new Date(rest.classes_date!).toISOString(),
				}));

			if (skipped > 0) {
				alert(`${skipped}개의 오늘 날짜 수업은 수정되지 않았습니다. 오늘 날짜의 수업 스케쥴은 수정할 수 없습니다.`);
			}

			
			const result3 = await ClassesService.updateRows(payload3);
			if (result3) {
				// alert('수업일정 정보 수정이 완료 되었습니다.');
			} else {
				alert('수업일정 정보 수정이 실패하였습니다');
			}

			// alert(`${skipped}개의 오늘 날짜 수업은 수정되지 않았습니다. 오늘 날짜의 수업 스케쥴은 수정할 수 없습니다.`);


			if (!paymentsRow) {
				alert('수업 정보가 없습니다.');
				return;
			}



			// classes list 가져와서 남은수업횟수 업데이트
			const list = await ClassesService.getByPaymentsId(paymentsRow.id)
			const classLength = list.filter(item => item.status === 10).length;

			// 결제 정보 수정
			const { member, teacher, curriculum, instrument, ...payload1 } = paymentsRow;
			const reuslt1 = await PaymentsService.update({
				...payload1,
				remaining_classes: classLength
			});
			if (reuslt1) {
				// alert('수정 완료 되었습니다.');
			} else {
				alert('수정 실패하였습니다');
			}



		

			const paymentsList = await PaymentsService.getByMemberIdAndStatus(paymentsRow.member_id, 20); // 새로운 메서드 추가 필요
			const remainingClasses = paymentsList.reduce((sum, payment) => sum + payment.remaining_classes!, 0); // 남은 수업 횟수
			
			// 남은 수업횟수 업데이트
			const result = await MemberService.update({
				...memberRow,
				remaining_classes: remainingClasses,
			});


			// 수업 일정이 변경되었을 경우 회원에게 카카오, 이메일 알림톡
			const schedule1 = classesList.map(u => u.classes_date).join(',');
			const schedule2 = classesList2.map(u => u.classes_date).join(',');
			const isSame = schedule1 === schedule2;
			if(!isSame) {
				if(memberRow) {


					// 관리자에게 수업 변경 알림톡 
					await MemberService.sendKakao({
						phone: '01051321404',
						code: 'TR_3001',
						content: `${paymentsRow?.teacher?.name} 선생님이 ${paymentsRow?.member?.name} 님 수업 일정을 변경하였습니다.`
					});


					if(memberRow?.notification_type === '카카오알림톡') {
						if(memberRow.cellphone) {
							await MemberService.sendKakao({
								phone: memberRow.cellphone.replace(/-/g, ""),
								code: 'TH_8115',
								content: `${paymentsRow?.instrument?.name} 수업의 일정이 변경되었습니다. 내 강의실 메뉴에서 확인해주세요.`
							});
						}
	
					} else if (memberRow.user_id && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(memberRow.user_id)) {
						await MemberService.sendEmail({
							email: memberRow.user_id,
							subject:'[탬버린 뮤직] 수업의 일정이 변경 되었습니다.',
							content: `${paymentsRow?.instrument?.name} 수업의 일정이 변경되었습니다. 내 강의실 메뉴에서 확인해주세요.`
						});
					}
				}
			}



			alert('수정 완료 되었습니다.');

		} catch (error) {
			console.error('수업정보 수정 실패:', error);
		}
	}


	const repeatOddClasses = (startIndex: number) => {
		setClassesList((prevList) => {
			// 기준 날짜 가져오기
			let baseDateTime = prevList[startIndex]?.classes_date;

			if (!baseDateTime) {
				alert('기본 날짜와 시간이 설정되어 있어야 합니다.');
				return prevList;
			}
			if (!(baseDateTime instanceof Date)) {
				baseDateTime = new Date(baseDateTime);
			}

			const newList = prevList.map((classItem, index) => {
				// 전체 리스트 기준으로 홀수 인덱스만 날짜를 7일씩 증가
				if (index > startIndex && index % 2 === 0) {
					return {
						...classItem,
						classes_date: new Date(baseDateTime.getTime() + 7 * 24 * 60 * 60 * 1000 * Math.ceil((index - startIndex) / 2)),
					};
				}
				return classItem;
			});

			return newList;
		});
	};

	const repeatEvenClasses = (startIndex: number) => {
		setClassesList((prevList) => {
			// 기준 날짜 가져오기
			let baseDateTime = prevList[startIndex]?.classes_date;

			if (!baseDateTime) {
				alert('기본 날짜와 시간이 설정되어 있어야 합니다.');
				return prevList;
			}
			if (!(baseDateTime instanceof Date)) {
				baseDateTime = new Date(baseDateTime);
			}

			const newList = prevList.map((classItem, index) => {
				// 전체 리스트 기준으로 짝수 인덱스만 날짜를 7일씩 증가
				if (index > startIndex && index % 2 === 1) {
					return {
						...classItem,
						classes_date: new Date(baseDateTime.getTime() + 7 * 24 * 60 * 60 * 1000 * Math.ceil((index - startIndex) / 2)),
					};
				}
				return classItem;
			});

			return newList;
		});
	};

	const repeatWeeklyClasses = (startIndex: number) => {
		setClassesList((prevList) => {
			let baseDateTime = prevList[startIndex]?.classes_date;
	
			if (!baseDateTime) {
				alert('기본 날짜와 시간이 설정되어 있어야 합니다.');
				return prevList;
			}
			if (!(baseDateTime instanceof Date)) {
				baseDateTime = new Date(baseDateTime);
			}
	
			const newList = prevList.map((classItem, index) => {
				if (index > startIndex) {
					return {
						...classItem,
						classes_date: new Date(baseDateTime.getTime() + 7 * 24 * 60 * 60 * 1000 * (index - startIndex)),
					};
				}
				return classItem;
			});
	
			return newList;
		});
	};
	
	// 페이지네이션 계산 로직
	const sortedBoardList = [...classesBoardList].sort((a, b) => {
		// 작성일(created_date) 기준으로 오름차순 정렬
		const dateA = a.created_date ? new Date(a.created_date).getTime() : 0;
		const dateB = b.created_date ? new Date(b.created_date).getTime() : 0;
		return dateB - dateA;
	});

	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentBoardItems = sortedBoardList.slice(indexOfFirstItem, indexOfLastItem);
	const totalPages = Math.ceil(sortedBoardList.length / itemsPerPage);
	
	// 페이지 변경 함수
	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
	};
	
	// 페이지네이션 컴포넌트
	const renderPagination = () => {
		const pageNumbers: number[] = [];
		
		for (let i = 1; i <= totalPages; i++) {
			pageNumbers.push(i);
		}
		
		// totalPages가 0이면 페이지네이션 표시 안함
		if (totalPages === 0) return null;
		
		return (
			<div className="pagination">
				{pageNumbers.map(number => (
					<button 
						key={number} 
						onClick={() => handlePageChange(number)}
						className={`pagination-number ${currentPage === number ? 'active' : ''}`}
					>
						{number}
					</button>
				))}
			</div>
		);
	};

	return (
		<div className={`vh-content-wrap ${visible ? 'active' : ''}`}>
			<div className="classroom-detail">
				<div className="vw-inner">


					<h1 className="title">수업 강의실</h1>
					<ul className="info-group">
						<li>
							<h2>수업명</h2>
							<p>{paymentsRow?.instrument?.name}</p>
						</li>
						<li>
							<h2>선생님</h2>
							<p>{paymentsRow?.teacher?.name}</p>
						</li>
						<li>
							<h2>수업날짜</h2>
							<p>{classesRow?.classes_date && dayjs(classesRow.classes_date).format("YYYY-MM-DD HH:mm")}</p>
						</li>
						<li>
							<h2>수업구성</h2>
							<p>{paymentsRow?.curriculum?.name}</p>
						</li>
						{
							member?.type === 10 && (
								<>
									<li>
										<h2>수업링크</h2>
										<p className="link">{paymentsRow?.classes_link && (
											<a href={paymentsRow?.classes_link} target='_blank'>[수업 입장하기]</a>
										)}</p>
									</li>
									<li>
										<h2>출석여부</h2>
										<p>{classesRow?.status === 10 ? '수업전' : classesRow?.status === 20 ? '수업완료' : '수업불참'}</p>
									</li>
									<li>
										<h2>수업회차</h2>
										<p>전체 수업회차: {paymentsRow?.total_classes} <br />남은 회차: {paymentsRow?.remaining_classes}</p>
									</li>
									<li>
										<h2>전체 수업일정</h2>  {/* 838789 */}
										<div className="info-box">
											<ul className="schedule">
												{
													classesList.map((row, index) => (
														<li className={row.id === classesRow?.id ? 'active' : ''} key={row.id}><strong>[{index + 1} 회차]</strong> {row.classes_date && dayjs(row.classes_date).format("YYYY-MM-DD HH:mm")}</li>
													))
												}
											</ul>
										</div>
									</li>
								</>
							)
						}


						{
							member?.type === 20 && (
								<>
									<li>
										<h2>학생정보</h2>
										<p>{paymentsRow?.member?.name} ({paymentsRow?.member?.user_id}) / {paymentsRow?.member?.cellphone} / {paymentsRow?.member?.gender}<br />
											{paymentsRow?.member?.parent_name && (
												`부모님 정보 : ${paymentsRow?.member?.parent_name} / ${paymentsRow?.member?.parent_cellphone}`
											)}
										</p>
									</li>
									<li>
										<h2>줌링크 등록</h2>
										<div className="info-box">
											<input type="text" value={paymentsRow?.classes_link || ''} onChange={(e) =>
												setPaymentsRow((prev) =>
													prev ? { ...prev, classes_link: e.target.value } : prev
												)
											} />
										</div>
									</li>
									<li>
										<h2>출석여부</h2>
										<div className="info-box">
											<div className="checkbox check-type-01">
												<input type="radio" name="classesStatus" value="10" checked={classesRow?.status === 10} onChange={(e) =>
													setClassesRow((prev) =>
														prev ? { ...prev, status: Number(e.target.value) } : prev
													)
												} />
												<label>
													<span>수업전</span>
												</label>
											</div>
											<div className="checkbox check-type-01">
												<input type="radio" name="classesStatus" value="20" checked={classesRow?.status === 20} onChange={(e) =>
													setClassesRow((prev) =>
														prev ? { ...prev, status: Number(e.target.value) } : prev
													)
												} />
												<label>
													<span>수업완료</span>
												</label>
											</div>
											<div className="checkbox check-type-01">
												<input type="radio" name="classesStatus" value="30" checked={classesRow?.status === 30} onChange={(e) =>
													setClassesRow((prev) =>
														prev ? { ...prev, status: Number(e.target.value) } : prev
													)
												} />
												<label>
													<span>수업불참</span>
												</label>
											</div>
										</div>
									</li>
									<li>
										<h2>선생님 메모</h2>
										<div className="info-box">
											<textarea rows={10} value={paymentsRow?.teacher_memo} onChange={(e) =>
												setPaymentsRow((prev) =>
													prev ? { ...prev, teacher_memo: e.target.value } : prev
												)
											}></textarea>
										</div>
									</li>
									<li>
										<h2>수업회차</h2>
										<p>전체 수업회차: {paymentsRow?.total_classes} <br />남은 회차: {paymentsRow?.remaining_classes}</p>
									</li>
									<li>
										<h2>전체 수업일정</h2>
										<div className="info-box">
											<ul className="schedule-teacher">
												{
													classesList.map((row, index) => (
														<li key={row.id}>
															<div className="classes-index">[{index + 1}회차]</div>
															<input type="datetime-local"
																value={row.classes_date ? dayjs(row.classes_date).format('YYYY-MM-DDTHH:mm') : ''}
																onChange={(e) => {
																	const newDate = dayjs(e.target.value).format('YYYY-MM-DD HH:mm:ss');
																	const updatedList = classesList.map((item, idx) =>
																		idx === index ? { ...item, classes_date: newDate } : item
																	);
																	setClassesList(updatedList);
																}}
															/>
															<div className="btn-box">
																<button type="button" onClick={() => repeatOddClasses(index)}>홀수 회차반복</button>
																<button type="button" onClick={() => repeatEvenClasses(index)}>짝수 회차반복</button>
																<button type="button" onClick={() => repeatWeeklyClasses(index)}>매주 반복</button>
															</div>
														</li>
													))
												}
											</ul>
										</div>
									</li>
								</>
							)
						}
					</ul>

					{
						member?.type === 20 && (
							<div className="btn_area board-btn">
								<button type="button" className="update" onClick={() => onSubmitClasses()}>수정완료</button>
							</div>
						)}


					<h1 className="title chatTitle">실시간 채팅</h1>
					<div style={{ display: 'flex', flexDirection: 'column', height: '50vh', border: '1px solid #ddd', marginTop: '20px' }}>
						<div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
							{chatList.map((chat, index) => (
								<div
									key={index}
									className="liveChatTxt"
									style={{
										marginBottom: '10px',
										textAlign: chat.sender_id === member?.id ? 'right' : 'left'
									}}
								>
									<div style={{
										display: 'inline-block',
										backgroundColor: chat.sender_id === member?.id ? '#007bff' : '#e9ecef',
										color: chat.sender_id === member?.id ? 'white' : 'black',
										padding: '8px 12px',
										borderRadius: '15px',
										maxWidth: '70%'
									}}>
										{chat.content}
									</div>
								</div>
							))}
						</div>
						<div style={{
							display: 'flex',
							padding: '20px',
							borderTop: '1px solid #dee2e6'
						}}>
							<input
								type="text"
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
								style={{
									flex: 1,
									marginRight: '10px',
									padding: '8px',
									borderRadius: '4px',
									border: '1px solid #ced4da'
								}}
								placeholder="메시지를 입력하세요..."
							/>
							<button
								onClick={sendMessage}
								style={{
									padding: '8px 16px',
									backgroundColor: '#007bff',
									color: 'white',
									border: 'none',
									borderRadius: '4px',
									cursor: 'pointer'
								}}
							>
								전송
							</button>
						</div>
					</div>


					<h1 className="title class-board-title">수업 게시판</h1>
					<div className="board-list">
						<table>
							<thead>
								<tr>
									<th className="pc_only">No.</th>
									<th>내용</th>
									<th>작성자</th>
									<th className="pc_only">확인일시</th>
									<th>작성일</th>
								</tr>
							</thead>
							<tbody>
								{
									currentBoardItems.map((row, index) => (
										<tr key={row.id}>
											<td className="pc_only">{indexOfFirstItem + index + 1}</td>
											<td className="td-left"><Link to={`/mypage/board/${row.id}`}>{row.subject} ({row.reply_count})</Link></td>
											<td><Link to={`/mypage/board/${row.id}`}>{row.member?.name}</Link></td>
											<td className="pc_only">{row.viewed_date && dayjs(row.viewed_date).format('YYYY-MM-DD HH:mm')}</td>
											<td>{row.created_date && dayjs(row.created_date).format('YYYY-MM-DD')}</td>
										</tr>
									))
								}
							</tbody>
						</table>
						{renderPagination()}
					</div>

					<div className="btn_area board-btn">
						<button type="button" className="back" onClick={() => navigate(-1)} >뒤로가기</button>
						<Link to={`/mypage/board/new/${classesRow?.id}`}><button type="button" className="update">글쓰기</button></Link>
					</div>

				</div>
			</div >

		</div >
	);
}

export default ClassroomDetail;
