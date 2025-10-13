import { useMemo, useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import useGlobalStore from '@/stores/globalStore';
import { Form, Field } from '@/components/UI/Minimal/components/hook-form';

import { Board } from '@/models/board';

import BoardService from '@/services/BoardService';

const schema = zod.object({
	id: zod.number(),
	member_id: zod.number(),
	type: zod.string(),
	subject: zod.string().min(2, {message: '제목을 입력해 주세요.'}),
	content: zod.string().min(2, {message: '내용을 입력해 주세요.'}),
	created_by_type: zod.string(),
});


function BoardEdit() {
	const [visible, setVisible] = useState(false);
	const navigate = useNavigate();
	const { isAuthenticated, member } = useGlobalStore();
	const { id } = useParams();
	const [type, setType] = useState<string>();
	const [boardRow, setBoardRow] = useState<Board>();


	const defaultValues: Board = useMemo(() => ({
		id: boardRow?.id,
		admin_id: 0,
		member_id: isAuthenticated ? (member?.id ?? 0) : 0,
		type: boardRow?.type ?? '',
		category: '',
		subject: boardRow?.subject ?? '',
		content: boardRow?.content ?? '',
		count: 0,
		is_active: 'Y',
		is_deleted: 'N',
		created_by_type: 'member',
		created_date: new Date(),
		writer_name: '',
		writer_id: ''
	}), [member, type]);


	const methods = useForm<Board>({
		resolver: zodResolver(schema),
		defaultValues
	});


	async function loadInitialData() {
		const row = await BoardService.get(Number(id));
		if(row) {
			const boardType = row?.type === '공지사항' ? 'notice' : 'review';		
			if (boardType !== 'review') {
				alert('접근 권한이 없습니다.');
				navigate(-1);
				return;
			}
			setType(boardType);
			setBoardRow(row);
		}
		setVisible(true);
	}

	useEffect(() => {
		loadInitialData();
	}, [type, isAuthenticated, id]);


	useEffect(() => {
		methods.reset(defaultValues);
	}, [boardRow])

	

	const onError = (errors) => {
		if (errors.subject) {
			alert(errors.subject.message);
		} else if (errors.content) {
			alert(errors.content.message);
		}
	};

	const onSubmit = async (data: Board) => {
		try {
			console.log(data);
			const result = await BoardService.update(data);

			if (result) {
				alert("수강후기가 수정 완료 되었습니다.");
				navigate(`/board/${type}/list`);
			} else {
				alert("수강후기 수정이 실패했습니다.");
			}
		} catch (error) {
			console.error(error);
			alert("오류가 발생했습니다. 다시 시도해주세요.");
		}
	}


	return (
		<div className={`vh-content-wrap ${visible && 'active'}`}>
			<FormProvider {...methods}>
				<form onSubmit={methods.handleSubmit(onSubmit, onError)}>
					<div className="board-create">
						<div className="vw-inner">

							<h1 className="title">탬버린 수강후기</h1>
							<ul className="board-form">
								<li>
									<h2 className="pc_only">제목*</h2>
									<div className="info-box">
										<input type="text" {...methods.register('subject')} defaultValue={boardRow?.subject ?? ''} />
									</div>
								</li>
								<li>
									<h2 className="pc_only">내용*</h2>
									<div className="info-box">
										{/* <textarea rows={20} {...methods.register('content')}>{boardRow?.content}</textarea> */}
										<Field.Editor name="content" sx={{ maxHeight: 1000, height: 700 }} />
									</div>
								</li>
							</ul>

							<div className="devide"></div>

							<div className="btn_area">
								<button type="submit">수정완료</button>
							</div>
						</div>
					</div>
				</form>
			</FormProvider>
		</div >
	);
}

export default BoardEdit;
