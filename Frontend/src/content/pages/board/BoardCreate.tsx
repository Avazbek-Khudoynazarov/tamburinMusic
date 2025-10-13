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
	member_id: zod.number(),
	type: zod.string(),
	subject: zod.string().min(2, {message: '제목을 입력해 주세요.'}),
	content: zod.string().min(2, {message: '내용을 입력해 주세요.'}),
	created_by_type: zod.string(),
	created_date: zod.date(),
});


function BoardCreate() {
	const [visible, setVisible] = useState(false);
	const navigate = useNavigate();
	const { isAuthenticated, member } = useGlobalStore();
	const { type } = useParams();
	const boardType = type === 'notice' ? '공지사항' : '수강후기';


	const defaultValues: Board = {
		id: 0,
		admin_id: 0,
		member_id: isAuthenticated ? member?.id : 0,
		type: boardType,
		category: '',
		subject: '',
		content: '',
		count: 0,
		is_active: 'Y',
		is_deleted: 'N',
		created_by_type: 'member',
		created_date: new Date(),
		writer_name: '',
		writer_id: ''
	};


	const methods = useForm<Board>({
		resolver: zodResolver(schema),
		defaultValues
	});


	// console.log(methods.formState.errors);
	async function loadInitialData() {

		setVisible(true);
	}

	useEffect(() => {
		if (type !== 'review') {
			alert('접근 권한이 없습니다.');
			navigate(-1);
		}
		loadInitialData();

	}, [type, isAuthenticated]);

	

	const onError = (errors) => {
		if (errors.subject) {
			alert(errors.subject.message);
		} else if (errors.content) {
			alert(errors.content.message);
		}
	};

	const onSubmit = async (data: Board) => {
		try {
			const { id, ...payload } = data;
			console.log(data);
			const result = await BoardService.create(payload);

			if (result) {
				alert("수강후기가 등록 완료 되었습니다.");
				navigate(`/board/${type}/list`);
			} else {
				alert("수강후기 등록이 실패했습니다.");
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
										<input type="text" {...methods.register('subject')} />
									</div>
								</li>
								<li>
									<h2 className="pc_only">내용*</h2>
									<div className="info-box">
										{/* <textarea rows={20} {...methods.register('content')}></textarea> */}
										<Field.Editor name="content" sx={{ maxHeight: 1000, height: 700 }} />
									</div>
								</li>
							</ul>

							<div className="devide"></div>



							<div className="btn_area">
								<button type="submit">등록하기</button>
							</div>
						</div>
					</div>
				</form>
			</FormProvider>
		</div >
	);
}

export default BoardCreate;