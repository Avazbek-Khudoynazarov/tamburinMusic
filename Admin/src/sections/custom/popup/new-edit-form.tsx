import type { IPopupItem } from 'src/types/user';

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

import PopupService from 'src/services/PopupService';
import { CONFIG } from 'src/config-global';
// ----------------------------------------------------------------------

export type NewSchemaType = zod.infer<typeof NewSchema>;
export type EditSchemaType = zod.infer<typeof EditSchema>;


export const NewSchema = zod.object({
	name: zod.string().min(2, { message: '팝업명을 입력해 주세요' }),
	content: zod.string().optional(),
	button_label: zod.string().optional(),
	link_url: zod.string().optional(),
	image_file: zod.string().optional(),
	start_date: zod.preprocess((arg) => {
		if (typeof arg === 'string') {
			// 빈 문자열인 경우 null 반환 (옵션에 맞게 처리)
			if (arg.trim() === '') return null;
			return new Date(arg);
		}
		return arg;
	}, zod.date().nullable()),
	end_date: zod.preprocess((arg) => {
		if (typeof arg === 'string') {
			if (arg.trim() === '') return null;
			return new Date(arg);
		}
		return arg;
	}, zod.date().nullable()),
	is_active: zod.string().min(1),
	is_deleted: zod.string().min(1),
	created_date: zod.date(),
});
export const EditSchema = NewSchema.extend({ id: zod.number() });

// ----------------------------------------------------------------------

type Props = {
	currentItem?: IPopupItem;
};

export function NewEditForm({ currentItem }: Props) {
	const router = useRouter();


	// 폼의 초기값을 설정 - currentItem가 있으면 해당 유저의 데이터를 폼에 채우고, 없으면 기본값을 사용
	const defaultValues = useMemo(
		() => ({
			id: currentItem?.id || 0,
			name: currentItem?.name || '',
			content: currentItem?.content || '',
			button_label: currentItem?.button_label || '',
			link_url: currentItem?.link_url || '',
			image_file: currentItem?.image_file || '',
			start_date: currentItem?.start_date ? new Date(currentItem.start_date) : null,
			end_date: currentItem?.end_date ? new Date(currentItem.end_date) : null,
			is_active: currentItem?.is_active || 'N',
			is_deleted: currentItem?.is_deleted || 'N',
			created_date: currentItem?.created_date ? new Date(currentItem.created_date) : new Date(),
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







	const [selectedFiles, setSelectedFiles] = useState<{ [key: number]: File | string | null }>({
		1: null,
		2: null,
	});

	useEffect(() => {
		if (currentItem) {
			setSelectedFiles({
				1: currentItem.image_file || null,
			});
		}
	}, [currentItem]);


	const [selectedFileNames, setSelectedFileNames] = useState<{ [key: number]: string }>({
		1: '선택된 파일 없음',
		2: '선택된 파일 없음',
	});


	const handleFileChange = async (fileIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];

		if (file) {
			const MAX_SIZE = 5 * 1024 * 1024;

			if (file.size > MAX_SIZE) {
				alert('파일 크기는 5MB 이하여야 합니다.');
				return;
			}

			setSelectedFiles((prev) => ({ ...prev, [fileIndex]: file }));
			setSelectedFileNames((prev) => ({ ...prev, [fileIndex]: file.name }));
		}
	};


	// 제출 시 기본값 또는 새 파일 반영
	const onSubmit = handleSubmit(async (data: NewSchemaType) => {
		try {
			const uploadResults: { [key: number]: string } = {};

			try {
				const uploadPromises = Object.entries(selectedFiles)
					.filter(([_, file]) => file instanceof File) // File 타입만 업로드
					.map(async ([key, file]) => {
						const formData = new FormData();
						formData.append('file', file as File);
						const result = await PopupService.addAttachment(formData);
						if (result.filename) {
							uploadResults[Number(key)] = `${CONFIG.serverUrl}/${result.path.replace(/\\/g, '/')}`;
						}
					});

				await Promise.all(uploadPromises);

				data.image_file = uploadResults[1] || (typeof selectedFiles[1] === 'string' ? (selectedFiles[1] as string) : '');
			} catch (error) {
				console.error('파일 업로드 에러:', error);
				alert('파일 업로드에 실패했습니다.');
				return;
			}

			const updatedData: IPopupItem = {
				...data,
				start_date: data.start_date ? (data.start_date instanceof Date ? data.start_date : new Date(data.start_date)) : null,
				end_date: data.end_date ? (data.end_date instanceof Date ? data.end_date : new Date(data.end_date)) : null,
				id: currentItem?.id || undefined,
				is_deleted: data.is_deleted || 'N',
				created_date: data.created_date || new Date(),
			};

			if (currentItem) {
				const result = await PopupService.update(updatedData);
				if (result === 'success') {
					toast.success('팝업 정보가 수정되었습니다.');
					router.push(paths.popup.list);
				} else {
					toast.error('팝업 수정에 실패했습니다.');
				}
			} else {
				const result = await PopupService.create(updatedData);
				if (result) {
					toast.success('팝업 정보가 등록되었습니다.');
					router.push(paths.popup.list);
				} else {
					toast.error('팝업 등록에 실패했습니다.');
				}
			}

			reset();
		} catch (error) {
			console.error('오류 발생:', error);
			toast.error('오류가 발생했습니다. 다시 시도해주세요.');
		}
	});

	const formatLocalDate = (date: Date): string => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	};




	return (
		<Form methods={methods} onSubmit={onSubmit}>
			<Stack spacing={{ xs: 3, md: 5 }} sx={{ mt: 3, mx: 'auto', maxWidth: { xs: 720, xl: 1200 } }}>
				<Card>
					<CardHeader title="기본 정보" subheader="" sx={{ mb: 1 }} />
					<Divider />
					<Stack spacing={3} sx={{ p: 3 }}>
						<Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }} >
							<Field.Text name="name" label="팝업 타이틀" />
							<Field.Text
								name="content"
								multiline
								rows={5}
								label="팝업 내용"
								sx={{
									gridColumn: "1 / -1", // 전체 열을 차지
									"& .MuiInputBase-root": {
										overflow: "hidden", // 내용 넘침 방지
									},
								}}
							/>
							<Controller
								name="start_date"
								control={control}
								render={({ field: { value, onChange, ...rest } }) => (
									<TextField
										type="date"
										label="시작일"
										value={value ? formatLocalDate(new Date(value)) : ''}
										onChange={(e) => {
											const date = e.target.value ? new Date(e.target.value) : null;
											onChange(date);
										}}
										{...rest}
									/>
								)}
							/>
							<Controller
								name="end_date"
								control={control}
								render={({ field: { value, onChange, ...rest } }) => (
									<TextField
										type="date"
										label="종료일"
										value={value ? formatLocalDate(new Date(value)) : ''}
										onChange={(e) => {
											const date = e.target.value ? new Date(e.target.value) : null;
											onChange(date);
										}}
										{...rest}
									/>
								)}
							/>
							<Field.Text name="button_label" label="버튼 텍스트" />
							<Field.Text name="link_url" label="버튼 링크" />

							<Box sx={{ pl: '14px' }}>
								<Typography variant="subtitle2">썸네일</Typography><br />
								<Box>
									<input
										type="file"
										id="file1"
										key={selectedFiles[1] ? 'hasFile' : 'noFile'}
										style={{ display: 'none' }}
										onChange={(e) => {
											const file = e.target.files?.[0];
											if (file) {
												handleFileChange(1, e);
											}
										}}
									/>
									{typeof selectedFiles[1] === 'string' ? (
										<Box sx={{ mb: 2 }}>
											<img
												src={selectedFiles[1] as string}
												alt="이미지"
												style={{ maxWidth: '200px', maxHeight: '200px' }}
											/>
										</Box>
									) : selectedFiles[1] ? (
										selectedFiles[1]?.type.startsWith('image/') ? (
											<Box sx={{ mb: 2 }}>
												<img
													src={URL.createObjectURL(selectedFiles[1] as File)}
													alt="이미지"
													style={{ maxWidth: '200px', maxHeight: '200px' }}
												/>
											</Box>
										) : (
											<Box sx={{ mb: 2 }}>
												<a href={URL.createObjectURL(selectedFiles[1] as File)} download>
													다운로드 [{(selectedFiles[1] as File).name}]
												</a>
											</Box>
										)
									) : null}
									<Stack spacing={2} direction="row" alignItems="center">
										<Button
											variant="contained"
											component="label"
											htmlFor="file1"
										>
											파일 선택
										</Button>
										<Typography sx={{ flex: 1 }}>
											{selectedFileNames[1]}
										</Typography>
										{selectedFiles[1] && (
											<IconButton
												onClick={() => {
													const fileInput = document.getElementById('file1') as HTMLInputElement;
													if (fileInput) fileInput.value = '';

													setSelectedFiles(prev => ({ ...prev, 1: null }));
													setSelectedFileNames(prev => ({ ...prev, 1: '선택된 파일 없음' }));
												}}
											>
												<Iconify icon="mdi:delete" />
											</IconButton>
										)}
									</Stack>
								</Box>
							</Box>



							<Field.Text
								name="created_date"
								label="생성일"
								value={currentItem?.created_date ? new Date(currentItem.created_date).toLocaleDateString('ko-KR', {
									year: 'numeric',
									month: 'long',
									day: 'numeric',
									hour: '2-digit',
									minute: '2-digit'
								}) : ''}
								disabled
							/>


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
		</Form >
	);
}