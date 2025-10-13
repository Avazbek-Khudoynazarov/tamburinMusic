import type { IBoardItem, IMemberItem, IInstrumentItem, ICurriculumItem, IClassesItem, IMetaItem, IAttachmentItem } from '@/components/UI/Minimal/types/user';

import { z as zod } from 'zod';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Autocomplete from '@mui/material/Autocomplete';


import { Iconify } from '@/components/UI/Minimal/components/iconify';
import { paths } from '@/components/UI/Minimal/routes/paths';
import { useRouter, useParams } from '@/components/UI/Minimal/routes/hooks';

import { fData } from '@/utils/format-number';

import { Label } from '@/components/UI/Minimal/components/label';
import { toast } from '@/components/UI/Minimal/components/snackbar';
import { Form, Field, schemaHelper } from '@/components/UI/Minimal/components/hook-form';

import BoardService from '@/services/BoardService';
import AttachmentService from '@/services/AttachmentService';
import MetaService from '@/services/MetaService';
import * as CONFIG from '@/config';
// ----------------------------------------------------------------------

export type NewSchemaType = zod.infer<typeof NewSchema>;
export type EditSchemaType = zod.infer<typeof EditSchema>;


export const NewSchema = zod.object({
	admin_id: zod.number().optional(),
	member_id: zod.number().optional(),
	type: zod.string().min(2, { message: '게시판 종류를 선택해 주세요.' }),
	category: zod.string().optional(),
	subject: zod.string().min(2, { message: '제목을 입력해 주세요.' }),
	content: zod.string().min(2, { message: '내용을 입력해 주세요.' }),
	count: zod.number().default(0),
	is_active: zod.string(),
	is_deleted: zod.string(),
	created_by_type: zod.string(),
	writer_id: zod.string().optional(),
	writer_name: zod.string().optional(),
	created_date: zod.date(),
});

// 수정할 때는 id 필드를 추가합니다.
export const EditSchema = NewSchema.extend({
	id: zod.number(),
});

// ----------------------------------------------------------------------

type Props = {
	currentItem?: IBoardItem;
};

export function NewEditForm({ currentItem }: Props) {
	const router = useRouter();

	const { type = '' } = useParams();
	const boardType = type === 'notice' ? '공지사항' : type === 'faq' ? '자주묻는질문' : '수강후기';

	// 폼의 초기값을 설정 - currentItem가 있으면 해당 유저의 데이터를 폼에 채우고, 없으면 기본값을 사용
	const defaultValues = useMemo(() => ({
		id: currentItem?.id || 0,
		admin_id: currentItem?.admin_id || 1,
		member_id: currentItem?.member_id || 0,
		type: currentItem?.type || (type ? boardType : '공지사항'),
		category: currentItem?.category || (type === 'faq' ? '수업' : ''),
		subject: currentItem?.subject || '',
		content: currentItem?.content || '',
		count: currentItem?.count ?? 0,
		is_active: currentItem?.is_active || 'Y',
		is_deleted: currentItem?.is_deleted || 'N',
		created_by_type: currentItem?.created_by_type || 'admin',
		created_date: currentItem?.created_date ? new Date(currentItem.created_date) : new Date(),
		writer_id: currentItem?.writer_id || '',
		writer_name: currentItem?.writer_name || '',
	}), [currentItem, type, boardType]);

	// 유효성 검사 스키마를 동적으로 설정
	const validationSchema = useMemo(() => (currentItem ? EditSchema : NewSchema), [currentItem]);

	// react-hook-form을 사용해 폼을 설정
	const methods = useForm<NewSchemaType | EditSchemaType>({
		mode: 'onSubmit',
		// 등록, 수정에 맞는 폼 유효성 검사 실행
		resolver: zodResolver(validationSchema),
		defaultValues,
	});


	const {
		setValue,
		reset,
		watch,
		control,
		handleSubmit,
		formState: { isSubmitting },
	} = methods;

	useEffect(() => {
		if (currentItem) {
			reset(defaultValues);
		}
	}, [currentItem, defaultValues, reset]);


	const values = watch();


	// 첨부파일 리스트
	const [attachmentList, setAttachmentList] = useState<IAttachmentItem[]>([]);
	const [boardCategory, setBoardCategory] = useState<IMetaItem[]>([]);



	const loadInitialData = useCallback(async () => {
		setBoardCategory(await MetaService.getList('boardCategory'));
		if (!currentItem?.id) return;
		setAttachmentList(await AttachmentService.getByEntity('board', currentItem?.id));


	}, [currentItem]);


	useEffect(() => {
		loadInitialData();
	}, [loadInitialData]);

	useEffect(() => {
		if (attachmentList.length > 0) {
			const updatedSelectedFiles: { [key: number]: File | null } = {};
			const updatedSelectedFileNames: { [key: number]: string } = {};

			attachmentList.forEach((attachment, index) => {
				const file = new File([attachment.file], attachment.file_original, { type: 'application/octet-stream' });
				updatedSelectedFiles[index + 1] = file;
				updatedSelectedFileNames[index + 1] = attachment.file_original;
			});

			setSelectedFiles(updatedSelectedFiles);
			setSelectedFileNames(updatedSelectedFileNames);
		}
	}, [attachmentList]);

	// 게시글 수정 시 첨부파일 처리 및 삭제 로직
	const uploadAttachment = async (id: number) => {
		try {
			// 삭제된 파일을 서버에서 삭제
			const deletePromises = Object.entries(selectedFiles)
				.filter(([key, file]) => file === null && attachmentList[parseInt(key, 10) - 1]) // 10진수로 명시
				.map(([index]) => {
					const attachment = attachmentList[parseInt(index, 10) - 1]; // 10진수로 명시
					return AttachmentService.delete(attachment.id!); // 서버에서 삭제
				});

			await Promise.all(deletePromises); // 기존 첨부파일 삭제

			// 새로 선택된 파일들만 업로드 (기존에 로드된 파일과 다를 경우만)
			const uploadPromises = Object.entries(selectedFiles)
				.filter(([key, file]) => {
					const originalAttachment = attachmentList[parseInt(key, 10) - 1]; // 10진수로 명시
					return file !== null &&
						(originalAttachment?.file_original !== file.name || originalAttachment?.deleted);
				})
				.map(([_, file]) => {
					const formData = new FormData();
					formData.append('file', file!);
					return BoardService.addAttachment(formData);
				});

			const results = await Promise.all(uploadPromises);

			if (results.some(response => response.filename === '')) {
				alert('파일 업로드에 실패했습니다.');
				return;
			}

			const uploadedFiles = results.map(result => `${import.meta.env.VITE_SERVER_URL}/uploads/${result.filename}`);
			uploadedFiles.forEach(async (filePath, index) => {
				const originalFileName = selectedFiles[index + 1]?.name; // 사용자가 업로드한 원본 파일명
				await AttachmentService.create({
					entity_type: 'board',
					entity_id: id,
					file: filePath,
					file_original: originalFileName || '', // 원본 파일명
					file_size: 0, // 파일 사이즈
					created_date: new Date(),
				});
			});

		} catch (error) {
			console.error('파일 업로드 에러:', error);
			alert('파일 업로드에 실패했습니다.');
		}
	};


	// 수정 폼 제출 시 호출되는 onSubmit 함수 수정
	const onSubmit = handleSubmit(async (data: NewSchemaType) => {
		try {
			let result;
			const { writer_id, writer_name, ...payload } = data;

			if (currentItem) {
				result = await BoardService.update({
					...payload,
					id: currentItem.id,
				});

				if (result === 'success') {
					if (currentItem.id) {
						await uploadAttachment(currentItem.id); // 첨부파일 업로드 및 삭제 처리
					}
					toast.success('게시글 정보가 수정되었습니다.');
					router.back();
				} else {
					toast.error('게시글 수정에 실패했습니다.');
				}
			} else {
				result = await BoardService.create(payload);

				if (result) {
					await uploadAttachment(result.insertId); // 새로 등록된 게시글에 첨부파일 업로드
					toast.success('게시글 정보가 등록되었습니다.');
					router.back();
				} else {
					toast.error('게시글 등록에 실패했습니다.');
				}
			}

			reset();
		} catch (error) {
			console.error(error);
			toast.error('오류가 발생했습니다. 다시 시도해주세요.');
		}
	});


	// 첨부파일 삭제 로직 추가
	const handleFileDelete = async (fileIndex: number) => {
		// 기존의 삭제된 파일을 selectedFiles에서 null로 설정
		setSelectedFiles(prev => ({ ...prev, [fileIndex]: null }));
		setSelectedFileNames(prev => ({ ...prev, [fileIndex]: '선택된 파일 없음' }));

		// 삭제된 파일의 attachment을 찾아서 삭제
		const attachment = attachmentList[fileIndex - 1];
		if (attachment) {
			await AttachmentService.delete(attachment.id!); // 서버에서 파일 삭제
		}
	};

	const handleFileChange = async (fileIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];

		if (file) {
			const MAX_SIZE = 5 * 1024 * 1024;

			if (file.size > MAX_SIZE) {
				alert('파일 크기는 5MB 이하여야 합니다.');
				return;
			}

			setSelectedFiles(prev => ({ ...prev, [fileIndex]: file }));
			setSelectedFileNames(prev => ({ ...prev, [fileIndex]: file.name }));
		}
	};



	const fileCount = 3;

	const [selectedFiles, setSelectedFiles] = useState<{ [key: number]: File | null }>({
		1: null,
		2: null,
		3: null,
	});

	const [selectedFileNames, setSelectedFileNames] = useState<{ [key: number]: string }>({
		1: '선택된 파일 없음',
		2: '선택된 파일 없음',
		3: '선택된 파일 없음',
	});




	return (
		<Form methods={methods} onSubmit={onSubmit}>
			<Stack spacing={{ xs: 3, md: 5 }} sx={{ mt: 3, mx: 'auto', maxWidth: { xs: 720, xl: 1200 } }}>
				<Card>
					<CardHeader title="게시글" subheader="" sx={{ mb: 1 }} />
					<Divider />
					<Stack spacing={3} sx={{ p: 3 }}>
						<Box rowGap={3} columnGap={2} display="grid">
							<Field.Text name="subject" label="제목" sx={{ gridColumn: '1 / -1' }} />
							{(currentItem?.type === "자주묻는질문" || type === "faq") && (
								<Field.Select name="category" size="medium" label="카테고리" InputLabelProps={{ shrink: true }}>
									{boardCategory.map((row) => (
										<MenuItem key={row.entity_id} value={row.entity_id}>
											{row.entity_id}
										</MenuItem>
									))}
								</Field.Select>
							)}
							<Field.Editor name="content" sx={{ maxHeight: 1000, height: 700 }} />

							{/* 첨부파일 처리 */}
							<Box sx={{ width: '50%' }}>
								{Array.from({ length: fileCount }).map((_, index) => {
									const fileIndex = index + 1;
									return (
										<Box key={fileIndex} sx={{ mb: 2 }}>
											<input
												type="file"
												id={`file${fileIndex}`}
												key={selectedFiles[fileIndex] ? 'hasFile' : 'noFile'}
												style={{ display: 'none' }}
												onChange={(e) => {
													const file = e.target.files?.[0];
													if (file) {
														handleFileChange(fileIndex, e);
													}
												}}
											/>
											<Stack spacing={2} direction="row" alignItems="center" sx={{ mb: 2 }}>
												<Button variant="contained" component="label" htmlFor={`file${fileIndex}`}>
													파일 선택
												</Button>
												<Typography sx={{ flex: 1 }}>{selectedFileNames[fileIndex]}</Typography>
												{selectedFiles[fileIndex] && (
													<IconButton onClick={() => handleFileDelete(fileIndex)}>
														<Iconify icon="mdi:delete" />
													</IconButton>
												)}
											</Stack>
											{selectedFiles[fileIndex]?.type.startsWith('image/') ? (
												<Box sx={{ mb: 2 }}>
													<img
														src={URL.createObjectURL(selectedFiles[fileIndex])}
														alt="이미지 미리보기"
														style={{ maxWidth: '200px', maxHeight: '200px' }}
													/>
												</Box>
											) : (
												selectedFiles[fileIndex] && (
													<Box sx={{ mb: 2 }}>
														<a href={URL.createObjectURL(selectedFiles[fileIndex])} download>
															다운로드 [{selectedFiles[fileIndex].name}]
														</a>
													</Box>
												)
											)}
										</Box>
									);
								})}
							</Box>
						</Box>
					</Stack>
				</Card>

				<Stack direction="row" alignItems="flex-end" justifyContent="flex-end" sx={{ mt: 3, gap: '10px' }}>
					<LoadingButton color="inherit" size="large" variant="outlined" onClick={() => router.back()}>
						목록으로
					</LoadingButton>
					<LoadingButton type="submit" variant="contained" size="large">
						{!currentItem ? '등록 완료' : '수정 완료'}
					</LoadingButton>
				</Stack>


			</Stack>
		</Form>
	);
}