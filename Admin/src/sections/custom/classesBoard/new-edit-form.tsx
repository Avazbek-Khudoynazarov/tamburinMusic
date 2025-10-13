import type { IClassesBoardItem, IClassesBoardReplyItem, IMemberItem, IInstrumentItem, ICurriculumItem, IClassesItem, IMetaItem, IAttachmentItem } from 'src/types/user';

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


import { Iconify } from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import ClassesBoardService from 'src/services/ClassesBoardService';
import ClassesBoardReplyService from 'src/services/ClassesBoardReplyService';
import AttachmentService from 'src/services/AttachmentService';
import { CONFIG } from 'src/config-global';

import { PostCommentList } from './post-comment-list';
// ----------------------------------------------------------------------

export type NewSchemaType = zod.infer<typeof NewSchema>;
export type EditSchemaType = zod.infer<typeof EditSchema>;


export const NewSchema = zod.object({
	member_id: zod.number(),
	payments_id: zod.number(),
	classes_id: zod.number(),
	subject: zod.string(),
	content: zod.string().optional(),
	is_deleted: zod.string(),
	reply_count: zod.number().default(0),
	viewed_date: zod.date().nullable(),
	created_date: zod.date(),
});


export const EditSchema = NewSchema.extend({ id: zod.number() });

// ----------------------------------------------------------------------

type Props = {
	currentItem?: IClassesBoardItem;
};

export function NewEditForm({ currentItem }: Props) {
	const router = useRouter();


	// 폼의 초기값을 설정 - currentItem가 있으면 해당 유저의 데이터를 폼에 채우고, 없으면 기본값을 사용
	const defaultValues = useMemo(
		() => ({
			id: currentItem?.id || 0,
			member_id: currentItem?.member_id || 0,
			payments_id: currentItem?.payments_id || 0,
			classes_id: currentItem?.classes_id || 0,
			subject: currentItem?.subject || "",
			content: currentItem?.content || "",
			is_deleted: currentItem?.is_deleted || "N",
			reply_count: currentItem?.reply_count || 0,
			viewed_date: currentItem?.viewed_date ? null : null,
			created_date: currentItem?.created_date ? new Date(currentItem.created_date) : new Date(),
			member: currentItem?.member || undefined,
			teacher: currentItem?.teacher || undefined,
			instrument: currentItem?.instrument || undefined,
			curriculum: currentItem?.curriculum || undefined,
		}),
		[currentItem]
	);

	// 유효성 검사 스키마를 동적으로 설정
	const validationSchema = useMemo(() => (currentItem ? EditSchema : NewSchema), [currentItem]);

	// react-hook-form을 사용해 폼을 설정
	const methods = useForm<NewSchemaType | EditSchemaType>({
		mode: 'onSubmit',
		// 등록, 수정에 맞는 폼 유효성 검사 실행
		resolver: zodResolver(validationSchema),
		defaultValues,
	});

	// console.log(methods.formState.errors);


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
	const [classesBoardRely, setClassesBoardRely] = useState<IClassesBoardReplyItem[]>([]);

	const loadInitialData = useCallback(async () => {
		if (currentItem?.id) {
			setClassesBoardRely(await ClassesBoardReplyService.getByClassesBoardId(currentItem?.id));
		}
		if (!currentItem?.id) return;
		setAttachmentList(await AttachmentService.getByEntity('classesBoard', currentItem?.id));

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
					return ClassesBoardService.addAttachment(formData);
				});

			const results = await Promise.all(uploadPromises);

			if (results.some(response => response.filename === '')) {
				alert('파일 업로드에 실패했습니다.');
				return;
			}

			const uploadedFiles = results.map(result => `${CONFIG.serverUrl}/uploads/${result.filename}`);
			uploadedFiles.forEach(async (filePath, index) => {
				const originalFileName = selectedFiles[index + 1]?.name; // 사용자가 업로드한 원본 파일명
				await AttachmentService.create({
					entity_type: 'classesBoard',
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
			if (currentItem) {
				result = await ClassesBoardService.update({
					...data,
					id: currentItem.id,
				});

				if (result === 'success') {
					if (currentItem.id) {
						await uploadAttachment(currentItem.id); // 첨부파일 업로드 및 삭제 처리
					}
					toast.success('수업 게시글 정보가 수정되었습니다.');
					router.push(paths.classesBoard.list);
				} else {
					toast.error('수업 게시글 수정에 실패했습니다.');
				}
			} else {
				result = await ClassesBoardService.create({
					...methods.getValues(),
				});

				if (result) {
					await uploadAttachment(result.insertId); // 새로 등록된 게시글에 첨부파일 업로드
					toast.success('수업 게시글 정보가 등록되었습니다.');
					router.push(paths.classesBoard.list);
				} else {
					toast.error('수업 게시글 등록에 실패했습니다.');
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
					<CardHeader title="수업 게시글" subheader="" sx={{ mb: 1 }} />
					<Divider />
					<Stack spacing={3} sx={{ p: 3 }}>
						<Box rowGap={3} columnGap={2} display="grid">
							<Field.Text name="subject" label="제목" sx={{ gridColumn: '1 / -1' }} />
							<Field.Editor name="content" sx={{ maxHeight: 1000, height: 700 }} />

							{/* 첨부파일 처리 */}
							<Box sx={{ width: '50%' }}>
								{/* {Array.from({ length: fileCount }).map((_, index) => {
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
								})} */}
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
												selectedFiles[fileIndex] && attachmentList[fileIndex - 1]?.file && (
													<Box sx={{ mb: 2 }}>
														<a href={attachmentList[fileIndex - 1].file} download>
															다운로드 [{attachmentList[fileIndex - 1].file_original}]
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

				{classesBoardRely.length > 0 && (
					<Card sx={{ p: '10px 30px' }}>
						<PostCommentList comments={classesBoardRely} />
					</Card>
				)}


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