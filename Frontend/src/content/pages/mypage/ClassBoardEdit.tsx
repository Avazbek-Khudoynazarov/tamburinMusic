import { useMemo, useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import useGlobalStore from '@/stores/globalStore';
import { Form, Field } from '@/components/UI/Minimal/components/hook-form';

import * as CONFIG from '@/config';

import { Classes } from '@/models/classes';
import { ClassesBoard } from '@/models/classesBoard';
import { Attachment } from '@/models/attachment';

import ClassesBoardService from '@/services/ClassesBoardService';
import AttachmentService from '@/services/AttachmentService';

const schema = zod.object({
	id: zod.number(),
	member_id: zod.number(),
	payments_id: zod.number(),
	classes_id: zod.number(),
	subject: zod.string().min(2, { message: '제목을 입력해 주세요.' }),
	content: zod.string().min(2, { message: '내용을 입력해 주세요.' }),
	reply_count: zod.number(),
	viewed_date: zod.string().nullable(),
	created_date: zod.string(),
});


function ClassBoardEdit() {
	const [visible, setVisible] = useState(false);
	const navigate = useNavigate();
	const { isAuthenticated, member } = useGlobalStore();
	const { id } = useParams();
	const [classesBoardRow, setClassesBoardRow] = useState<ClassesBoard>();
	const [attachmentList, setAttachmentList] = useState<Attachment[]>([]);

	const [files, setFiles] = useState<(File | null)[]>([null, null, null]);


	const defaultValues: ClassesBoard = {
		id: Number(id),
		member_id: member?.id ?? 0,
		payments_id: 0,
		classes_id: 0,
		subject: '',
		content: '',
		is_deleted: 'N',
		reply_count: 0,
		viewed_date: null,
		created_date: new Date(),
	};


	const methods = useForm<ClassesBoard>({
		resolver: zodResolver(schema),
		defaultValues
	});

	console.log(methods.formState.errors);


	async function loadInitialData() {
		setClassesBoardRow(await ClassesBoardService.get(Number(id)));
		setAttachmentList(await AttachmentService.getByEntity('classesBoard', Number(id)));
		setVisible(true);
	}

	useEffect(() => {
		loadInitialData();
	}, []);


	useEffect(() => {
		if (classesBoardRow) {
			methods.reset({
				...defaultValues,
				classes_id: Number(classesBoardRow.id),
				payments_id: classesBoardRow.payments_id,
				subject: classesBoardRow.subject,
				content: classesBoardRow.content,
				reply_count: classesBoardRow.reply_count,
				viewed_date: classesBoardRow.viewed_date,
				created_date: classesBoardRow.created_date,
			})
		}
	}, [classesBoardRow, methods.reset]);




	const onError = (errors) => {
		if (errors.subject) {
			alert(errors.subject.message);
		} else if (errors.content) {
			alert(errors.content.message);
		}
	};


	const onSubmit = async (data: ClassesBoard) => {
		try {
			const result = await ClassesBoardService.update(data);

			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				if (file) {
					const formData = new FormData();
					formData.append('file', file);
					const response = await ClassesBoardService.addAttachment(formData);
					const fileUrl = response.url || response.path; // S3 URL from backend
					const attachmentPayload: Attachment = {
						entity_type: 'classesBoard',
						entity_id: Number(id),
						file: fileUrl,
						file_original: file.name,
						file_size: file.size,
						created_date: new Date(),
					};
					// 만약 기존 첨부파일이 해당 index에 있으면 업데이트, 없으면 생성
					if (attachmentList[i]) {
						// 업데이트: 기존 첨부파일의 id를 포함하여 업데이트 API 호출
						attachmentPayload.id = attachmentList[i].id;
						await AttachmentService.update(attachmentPayload);
					} else {
						// 생성
						await AttachmentService.create(attachmentPayload);
					}
				}
			}



			if (result) {
				alert("수업게시글이 수정 완료 되었습니다.");
				navigate(-1);
			} else {
				alert("수업게시글 수정이 실패했습니다.");
			}
		} catch (error) {
			console.error(error);
			alert("오류가 발생했습니다. 다시 시도해주세요.");
		}
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
		const file = e.target.files?.[0] || null;
		if (file) {
			const MAX_SIZE = 20 * 1024 * 1024;

			if (file.size > MAX_SIZE) {
				alert('파일 크기는 20MB 이하여야 합니다.');
				e.stopPropagation();
				e.target.value = "";
				return false;
			}
			setFiles((prev) => {
				const newFiles = [...prev];
				newFiles[index] = file;
				return newFiles;
			});
		}
	};


	return (
		<div className={`vh-content-wrap ${visible && 'active'}`}>
			<FormProvider {...methods}>
				<form onSubmit={methods.handleSubmit(onSubmit, onError)}>
					<div className="board-create">
						<div className="vw-inner">

							<h1 className="title">수업게시글 수정</h1>
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
								<li>
									<h2>첨부파일</h2>
									<div className="info-box">
										{[...Array(3)].map((_, index) => (
											<div key={index}>
												<input
													type="file"
													onChange={(e) => handleFileChange(e, index)}
												/>
												{attachmentList[index] ? (
													<div>
														<a
															href={attachmentList[index].file}
															target="_blank"
															rel="noreferrer"
														>
															{attachmentList[index].file_original}
														</a>
													</div>
												) : (
													<p>파일 없음</p>
												)}
											</div>
										))}
									</div>
								</li>
							</ul>

							<div className="devide"></div>

							<div className="btn_area board-btn">
							<button type="button" className="back" onClick={() => navigate(-1)}>목록으로</button>
								<button type="submit">수정하기</button>
							</div>
						</div>
					</div>
				</form>
			</FormProvider>
		</div >
	);
}

export default ClassBoardEdit;