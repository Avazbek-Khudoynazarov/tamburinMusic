import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Board } from '@/models/board';
import BoardService from '@/services/BoardService';

function BoardList() {
	const [visible, setVisible] = useState(false);
	const [boardList, setBoardList] = useState<Board[]>([]);
	const navigate = useNavigate();
	const { type } = useParams();
	const boardType = type === 'notice' ? '공지사항' : '수강후기';

	async function loadInitialData() {
		setBoardList(await BoardService.getByType(boardType));
		setVisible(true);
	}

	useEffect(() => {
		loadInitialData();
	}, [boardType]);


	return (
		<div className={`vh-content-wrap ${visible && 'active'}`}>
			<div className="vw-inner">
				<div className="board-list board-list-cont">
					<h1>탬버린 {boardType}</h1>
					<table>
						<thead>
							<tr>
								<th className="pc_only">No.	</th>
								<th>내용</th>
								<th className="pc_only">작성자</th>
								<th>작성일</th>
							</tr>
						</thead>
						<tbody>
							{
								boardList.map((row, index) => (
									<tr key={row.id}>
										<td className="pc_only">{index + 1}</td>
										<td className="td-left"><Link to={`/board/${row.id}`}>{row.subject}</Link></td>
										<td className="pc_only">{row.writer_name}</td>
										<td>{new Date(row.created_date).toISOString().split('T')[0]}</td>
									</tr>
								))
							}
						</tbody>
					</table>
					{
						type == 'review' && (
							<div className="btn_area board-btn">
								<button type="button" className="update" onClick={() => navigate(`/board/${type}/new`)}>글쓰기</button>
							</div>
						)
					}
				</div>
			</div>
		</div>
	);
}

export default BoardList;
