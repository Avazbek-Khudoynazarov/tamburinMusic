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

import MemberService from '@/services/MemberService';
import ClassesService from '@/services/ClassesService';
import ClassesBoardService from '@/services/ClassesBoardService';
import AttachmentService from '@/services/AttachmentService';

const schema = zod.object({
	member_id: zod.number(),
	payments_id: zod.number(),
	classes_id: zod.number(),
	subject: zod.string().min(2, { message: '제목을 입력해 주세요.' }),
	content: zod.string().min(2, { message: '내용을 입력해 주세요.' }),
	created_date: zod.date(),
});


function ClassBoardCreate() {
	const [visible, setVisible] = useState(false);
	const navigate = useNavigate();
	const { isAuthenticated, member } = useGlobalStore();
	const { id } = useParams();
	const [classesRow, setClassesRow] = useState<Classes>();
	const [attachmentList, setAttachmentList] = useState<Attachment[]>([]);

	const [files, setFiles] = useState<(File | null)[]>([null, null, null]);


	const defaultValues: ClassesBoard = {
		id: 0,
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


	async function loadInitialData() {
		setClassesRow(await ClassesService.get(Number(id)));
		setVisible(true);
	}

	useEffect(() => {
		loadInitialData();
	}, []);


	useEffect(() => {
		if (classesRow) {
			methods.reset({
				...defaultValues,
				classes_id: Number(classesRow.id),
				payments_id: Number(classesRow.payments_id),
			})
		}
	}, [classesRow, methods.reset]);




	const onError = (errors) => {
		if (errors.subject) {
			alert(errors.subject.message);
		} else if (errors.content) {
			alert(errors.content.message);
		}
	};

	const onSubmit = async (data: ClassesBoard) => {
		try {
			const { id, ...payload } = data;
			console.log(payload);
			console.log(classesRow);
			const result = await ClassesBoardService.create(payload);

			console.log(result);

			if (result.insertId) {
				for (const file of files) {
					if (file) {
						// FormData를 사용해 파일과 관련 정보를 백엔드로 전송
						const formData = new FormData();
						formData.append('file', file);
						console.log(formData);
						const response = await ClassesBoardService.addAttachment(formData);

						const item = {
							entity_type: 'classesBoard',
							entity_id: result.insertId,
							file: response.url || response.path, // S3 URL from backend
							file_original: file.name,
							file_size: file.size,
							created_date: new Date(),
							}
							console.log(item);
							await AttachmentService.create(item);
					}
				}
				let email;
				let phone;
				let classTitle;

				// 선생에게 발송
				if(payload.member_id == classesRow?.member_id) {
					// 등록자가 학생일 경우, email/phone은 선생님으로 설정
					email = classesRow?.teacher?.user_id;
					phone = classesRow?.teacher?.cellphone;
					classTitle = `[${classesRow?.member?.name}]`;

					if(classesRow?.member?.notification_type) {
						if(classesRow?.member?.notification_type === '카카오알림톡') {
							if(phone) {
								await MemberService.sendKakao({
									phone: phone.replace(/-/g, ""),
									code: 'UA_7269',
									content: `${classTitle} 수업 게시판에 ${classesRow?.member?.name} 학생이 새로운 게시글이 작성하였습니다. 내 강의실 메뉴에서 확인해 주세요.
(해당 신규 게시글 등록 메시지는 고객님의 알림신청에 의해 발송되었습니다)`
								});
							}
		
						} else {
							if(email) {
								const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
								if (emailRegex.test(email)) {
									await MemberService.sendEmail({
										email: email,
										subject:'[탬버린 뮤직] 수업 게시판에 새로운 게시글이 작성 되었습니다',
										content: `${classTitle} 수업 게시판에 ${classesRow?.member?.name} 학생이 새로운 게시글이 작성하였습니다. 내 강의실 메뉴에서 확인해 주세요.`
									});
								}
							}
						}
					}


				// 학생에게 발송
				} else {
					email = classesRow?.member?.user_id;
					phone = classesRow?.member?.cellphone;
					classTitle = classesRow?.instrument?.name;


					if(classesRow?.member?.notification_type) {
						if(classesRow?.member?.notification_type === '카카오알림톡') {
							if(phone) {
								await MemberService.sendKakao({
									phone: phone.replace(/-/g, ""),
									code: 'TH_8116',
									content: `${classTitle} 수업 게시판에 새로운 게시글이 작성 되었습니다. 내 강의실 메뉴에서 확인해 주세요.`
								});
							}
		
						} else {
							if(email) {
								const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
								if (emailRegex.test(email)) {
									await MemberService.sendEmail({
										email: email,
										subject:'[탬버린 뮤직] 수업 게시판에 새로운 게시글이 작성 되었습니다',
										content: `${classTitle} 수업 게시판에 새로운 게시글이 작성 되었습니다. 내 강의실 메뉴에서 확인해 주세요.`
									});
								}
							}
						}
					}
				}

			

			}

			

			if (result) {
				alert("수업게시글이 등록 완료 되었습니다.");
				navigate(-1);
			} else {
				alert("수업게시글 등록이 실패했습니다.");
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

							<h1 className="title">수업게시글 등록</h1>
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
										<div>
											<input type="file" onChange={(e) => handleFileChange(e, 0)} />
										</div>
										<div>
											<input type="file" onChange={(e) => handleFileChange(e, 1)} />
										</div>
										<div>
											<input type="file" onChange={(e) => handleFileChange(e, 2)} />
										</div>
									</div>
								</li>
							</ul>

							<div className="devide"></div>

							<div className="btn_area board-btn">
								<button type="button" className="back" onClick={() => navigate(-1)}>목록으로</button>
								<button type="submit">등록하기</button>
							</div>
						</div>
					</div>
				</form>
			</FormProvider>
		</div >
	);
}

export default ClassBoardCreate;