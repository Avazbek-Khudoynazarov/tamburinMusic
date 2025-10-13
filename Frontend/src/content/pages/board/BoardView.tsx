import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Board } from '@/models/board';
import { Attachment } from '@/models/attachment';

import BoardService from '@/services/BoardService';
import AttachmentService from '@/services/AttachmentService';

import useGlobalStore from '@/stores/globalStore';

function BoardView() {
	const [visible, setVisible] = useState(false);
	const [boardRow, setBoardRow] = useState<Board>();
	const [attachmentList, setAttachmentList] = useState<Attachment[]>([]);
	const { id } = useParams();
	const { isAuthenticated, member } = useGlobalStore();
	const navigate = useNavigate();
	const [type, setType] = useState<string>();

	async function loadInitialData() {
		const row = await BoardService.get(Number(id));
		if (row) {
			if (!sessionStorage.getItem(`board_viewed${row.id}`)) {
				await BoardService.updateCount(row.id);
				sessionStorage.setItem(`board_viewed${row.id}`, 'true');
			}
			setAttachmentList(await AttachmentService.getByEntity('board', Number(id)));
			setBoardRow(row);
		}
		setVisible(true);
	}

	useEffect(() => {
		loadInitialData();
		const boardType = boardRow?.type === '공지사항' ? 'notice' : 'review';
		setType(boardType);
	}, [boardRow]);

	async function handleDelete() {
		if (member && member?.id !== boardRow?.member_id) {
			alert('삭제할 권한이 없습니다.');
			return;
		}
		try {
			const result = await BoardService.delete(Number(id));
			if (result) {
				alert("삭제되었습니다.");
				navigate(`/board/${type}/list`);
			} else {
				alert("삭제에 실패했습니다.");
			}
		} catch (error) {
			console.error(error);
			alert('게시글 삭제에 실패했습니다.');
		}


	}


	return (
		<div className={`vh-content-wrap ${visible && 'active'}`}>
			<div className="board-view">
				<div className="vw-inner">


					<div className="header">
						<span><i className="far fa-user"></i> By {boardRow?.writer_name}</span>
						<span><i className="far fa-calendar-alt"></i> {boardRow?.created_date && new Date(boardRow?.created_date).toISOString().split('T')[0]}</span>
						{
							attachmentList.map((row, index) => (
								<span key={index}><i className="far fa-file"></i> <a href={row.file} download={row.file_original}>{row.file_original}</a></span>
							))
						}
					</div>
					<h1 className="title">{boardRow?.subject}</h1>
					<div className="content" dangerouslySetInnerHTML={{ __html: boardRow?.content ?? '' }}></div>

					<div className="devide"></div>

					{
						isAuthenticated && boardRow?.created_by_type == 'member' && member?.id == boardRow?.member_id ? (
							<div className="btn_area board-btn">
								<button type="button" className="back" onClick={() => navigate(-1)}>목록으로</button>
								<button type="button" className="update" onClick={() => navigate(`/board/edit/${id}`)}>수정하기</button>
								<button type="button" className="delete" onClick={() => handleDelete}>삭제하기</button>
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

export default BoardView;
