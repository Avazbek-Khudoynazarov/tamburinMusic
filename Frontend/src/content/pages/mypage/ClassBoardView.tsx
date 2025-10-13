import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { ClassesBoard } from '@/models/classesBoard';
import { ClassesBoardReply } from '@/models/classesBoardReply';

import ClassesBoardService from '@/services/ClassesBoardService';
import ClassesBoardReplyService from '@/services/ClassesBoardReplyService';
import AttachmentService from '@/services/AttachmentService';

import useGlobalStore from '@/stores/globalStore';
import { Attachment } from '@/models/attachment';
import { Curriculum } from '@/models/curriculum';
import { Member } from '@/models/member';
import { Instrument } from '@/models/instrument';

const commentSchema = zod.object({
	id: zod.number(),
	classes_id: zod.number(),
	classes_board_id: zod.number(),
	member_id: zod.number(),
	content: zod.string().min(2, { message: '댓글 내용을 입력해 주세요' }),
	is_deleted: zod.string(),
	created_date: zod.date(),
});

function ClassClassesBoardView() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { member } = useGlobalStore();

	const [visible, setVisible] = useState(false);
	const [classesBoardRow, setclassesBoardRow] = useState<ClassesBoard>();
	const [classesBoardReplyList, setClassesBoardReplyList] = useState<ClassesBoardReply[]>([]);
	const [attachmentList, setAttachmentList] = useState<Attachment[]>([]);
	const [replyCount, setReplyCount] = useState<number>(0);
	const [editingReplyId, setEditingReplyId] = useState(null);


	const defaultValues = {
		id: 0,
		classes_id: 0,
		classes_board_id: Number(id),
		member_id: Number(member?.id),
		content: '',
		is_deleted: 'N',
		created_date: new Date(),
	}

	const {
		register: registerNew,
		handleSubmit: handleSubmitNew,
		reset: resetNew,
		formState: { errors: newErrors }
	} = useForm({
		resolver: zodResolver(commentSchema),
		defaultValues
	});

	const {
		register: registerEdit,
		handleSubmit: handleSubmitEdit,
		reset: resetEdit,
		formState: { errors: editErrors }
	} = useForm({
		resolver: zodResolver(commentSchema),
		defaultValues
	});


	async function loadReplyData() {
		try {
			const replies = await ClassesBoardReplyService.getByClassesBoardId(Number(id));
			setClassesBoardReplyList(replies);
			setReplyCount(replies.length);
		} catch (error) {
			console.error('댓글 데이터를 불러오는데 실패했습니다:', error);
		}
	}

	async function loadInitialData() {
		try {
			const row = await ClassesBoardService.get(Number(id));
			if (row) {
				setAttachmentList(await AttachmentService.getByEntity('classesBoard', Number(id)));
				setclassesBoardRow(row);
				await loadReplyData();
				// 게시글 확인 날짜 업데이트
				if(!row.viewed_date && row.member_id !== member?.id) {
					const { curriculum, instrument, member, student, teacher, ...payload } = row;
					await ClassesBoardService.update({
						...payload,
						viewed_date: new Date()
					})
				}
			}
			setVisible(true);
		} catch (error) {
			console.error('데이터를 불러오는데 실패했습니다:', error);
		}
	}

	useEffect(() => {
		loadInitialData();
		window.scrollTo(0, 0);
	}, [id]);


	useEffect(() => {
		if (classesBoardRow) {
			resetNew({
				...defaultValues,
				classes_id: Number(classesBoardRow.classes_id),
			})
			resetEdit({
				...defaultValues,
				classes_id: Number(classesBoardRow.classes_id),
			})
		}
	}, [classesBoardRow, resetNew, resetEdit]);



	async function replyCountUpdate() {
		const replies = await ClassesBoardReplyService.getByClassesBoardId(Number(id));
		const { curriculum, instrument, member, student, teacher, ...payload } = classesBoardRow as {
			curriculum?: Curriculum;
			instrument?: Instrument;
			member?: Member;
			student?: Member;
			teacher?: Member;
			payload?: ClassesBoard;
		};
		await ClassesBoardService.update({
			...payload,
			reply_count: replies.length
		} as ClassesBoard)
	}


	// 게시글 삭제
	async function handleDelete() {
		if (member && member?.id !== classesBoardRow?.member_id) {
			alert('삭제할 권한이 없습니다.');
			return;
		}
		try {
			if (confirm('삭제 하시겠습니까?')) {
				const result = await ClassesBoardService.delete(Number(id));

				if (result) {
					alert("삭제되었습니다.");
					navigate(-1);
				} else {
					alert("삭제에 실패했습니다.");
				}
			}
		} catch (error) {
			console.error(error);
			alert('게시글 삭제에 실패했습니다.');
		}
	}

	// 댓글 삭제하기
	async function handleCommentDelete(replyId) {
		const comment = classesBoardReplyList.find((row) => row.id === replyId);
		if (!comment) return;

		if (member?.id !== comment.member?.id) {
			alert('삭제할 권한이 없습니다.');
			return;
		}

		try {
			if (confirm('댓글을 삭제 하시겠습니까?')) {
				const result = await ClassesBoardReplyService.delete(replyId);
				await replyCountUpdate();
				if (result) {
					await loadReplyData();
				} else {
					alert('댓글 삭제에 실패했습니다.');
				}
			}
		} catch (error) {
			console.error('댓글 삭제 오류:', error);
			alert('댓글 삭제 중 오류가 발생했습니다.');
		}
	}


	// 신규 댓글 등록하기
	const onSubmitNew = async (data) => {
		try {
			const { id, ...payload } = data;
			const result = await ClassesBoardReplyService.create(payload);
			await replyCountUpdate();
			if (result) {
				await loadReplyData();
				resetNew();
			} else {
				alert('댓글 등록에 실패했습니다.');
			}
		} catch (error) {
			console.error('댓글 등록 오류:', error);
			alert('댓글 등록 중 오류가 발생했습니다.');
		}
	};

	// 댓글 수정하기
	const onSubmitEdit = async (data) => {
		try {
			const { created_date, ...payload } = data;
			const result = await ClassesBoardReplyService.update({
				id: editingReplyId,
				...payload
			});
			if (result) {
				setEditingReplyId(null);
				resetEdit();
				loadReplyData();
			} else {
				alert('댓글 수정에 실패했습니다.');
			}
		} catch (error) {
			console.error('댓글 수정 오류:', error);
			alert('댓글 수정 중 오류가 발생했습니다.');
		}
	};

	// 댓글 수정창 열기 (토글)
	function toggleUpdate(replyId, currentContent) {
		setEditingReplyId(replyId);
		resetEdit({
			...defaultValues,
			content: currentContent
		});
	}



	return (
		<div className={`vh-content-wrap ${visible && 'active'}`}>
			<div className="board-view classes-board-view">
				<div className="vw-inner">


					<div className="header">
						<span><i className="far fa-user"></i> By {classesBoardRow?.member?.name}</span>
						<span><i className="far fa-calendar-alt"></i> {classesBoardRow?.created_date && dayjs(classesBoardRow?.created_date).format('YYYY-MM-DD')}</span>
						{
							attachmentList.map((row, index) => (
								<span key={index}><i className="far fa-file"></i> <a href={row.file} download={row.file_original}>{row.file_original}</a></span>
							))
						}
					</div>
					<h1 className="title">{classesBoardRow?.subject}</h1>
					<div className="content" dangerouslySetInnerHTML={{ __html: classesBoardRow?.content ?? '' }}></div>

					<div className="devide"></div>

					<h2 className="comment-title">Comments ({replyCount})</h2>
					<ul className="comment">
						{
							classesBoardReplyList.map((row, index) => (
								<li key={row.id}>
									<div className="icon-cont">
										<i className="fas fa-comments"></i>
									</div>
									<div className="comment-content">
										<h1>{row.member?.name} <span>{dayjs(row.created_date).format('YYYY-MM-DD HH:mm')}</span></h1>
										{editingReplyId === row.id ? (
											<form onSubmit={handleSubmitEdit(onSubmitEdit)}>
												<textarea
													rows={4}
													defaultValue={row.content}
													{...registerEdit('content')}
												/>
												{editErrors.content && <p>{editErrors.content.message}</p>}
												<button type="submit"><i className="fas fa-check-circle"></i> 등록</button>
												<button
													type="button"
													onClick={() => {
														setEditingReplyId(null);
														resetEdit();
													}}
													className="btn-comment-update-cancle"
												>
													<i className="fas fa-check-circle"></i> 취소
												</button>
											</form>
										) : (
											<p>{row.content}</p>
										)}
										{
											member?.id == row.member_id && (
												<div className="btn-cont">
													<button type="button" className="update-comment" onClick={() => toggleUpdate(row.id, row.content)}><i className="fas fa-edit"></i>수정</button>
													<button type="button" className="delete-comment" onClick={() => handleCommentDelete(row.id)}><i className="fas fa-trash"></i>삭제</button>
												</div>
											)
										}
									</div>
								</li>
							))
						}
					</ul>

					<div className="comment-new">
						<h3>댓글 남기기</h3>
						<form onSubmit={handleSubmitNew(onSubmitNew)} className="editor">
							<textarea rows={10} {...registerNew('content')}></textarea>
							{newErrors.content && <p>{newErrors.content.message}</p>}
							<div className="btn_area">
								<button type="submit">등록하기</button>
							</div>
						</form>
					</div>

					{
						member?.id == classesBoardRow?.member_id ? (
							<div className="btn_area board-btn">
								<button type="button" className="back" onClick={() => navigate(-1)}>목록으로</button>
								<button type="button" className="update" onClick={() => navigate(`/mypage/board/edit/${id}`)}>수정하기</button>
								<button type="button" className="delete" onClick={() => handleDelete()}>삭제하기</button>
							</div>
						) : (
							<div className="btn_area board-btn">
								<button type="button" className="back" onClick={() => navigate(-1)}>목록으로</button>
							</div>
						)

					}



				</div>
			</div>
		</div>
	);
}

export default ClassClassesBoardView;
