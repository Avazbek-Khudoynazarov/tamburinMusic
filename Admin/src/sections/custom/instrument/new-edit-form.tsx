import type { IInstrumentItem } from 'src/types/user';

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

import InstrumentService from 'src/services/InstrumentService';
import { CONFIG } from 'src/config-global';
// ----------------------------------------------------------------------

export type NewSchemaType = zod.infer<typeof NewSchema>;
export type EditSchemaType = zod.infer<typeof EditSchema>;


export const NewSchema = zod.object({
	name: zod.string().min(2, { message: '악기명을 입력해 주세요' }),
	image_file1: zod.string(),
	image_file2: zod.string(),
	display_order: zod.number(),
	is_deleted: zod.string(),
	created_date: zod.date()
});

export const EditSchema = NewSchema.extend({ id: zod.number() });

// ----------------------------------------------------------------------

type Props = {
	currentItem?: IInstrumentItem;
};

export function NewEditForm({ currentItem }: Props) {
	const router = useRouter();

	// 폼의 초기값을 설정 - currentItem가 있으면 해당 유저의 데이터를 폼에 채우고, 없으면 기본값을 사용
	const defaultValues = useMemo(
		() => ({
			id: currentItem?.id || 0,
			name: currentItem?.name || '',
			image_file1: currentItem?.image_file1 || '',
			image_file2: currentItem?.image_file2 || '',
			display_order: currentItem?.display_order || 1,
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
				1: currentItem.image_file1 || null,
				2: currentItem.image_file2 || null,
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
						const result = await InstrumentService.addAttachment(formData);
						if (result.filename) {
							uploadResults[Number(key)] = `${CONFIG.serverUrl}/${result.path.replace(/\\/g, '/')}`;
						}
					});

				await Promise.all(uploadPromises);

				data.image_file1 = uploadResults[1] || (typeof selectedFiles[1] === 'string' ? (selectedFiles[1] as string) : '');
				data.image_file2 = uploadResults[2] || (typeof selectedFiles[2] === 'string' ? (selectedFiles[2] as string) : '');
			} catch (error) {
				console.error('파일 업로드 에러:', error);
				alert('파일 업로드에 실패했습니다.');
				return;
			}

			const updatedData: IInstrumentItem = {
				...data,
				id: currentItem?.id || undefined,
				display_order: data.display_order || 0,
				is_deleted: data.is_deleted || 'N',
				created_date: data.created_date || new Date(),
			};

			if (currentItem) {
				const result = await InstrumentService.update(updatedData);
				if (result === 'success') {
					toast.success('악기 정보가 수정되었습니다.');
					router.push(paths.instrument.list);
				} else {
					toast.error('악기 수정에 실패했습니다.');
				}
			} else {
				const result = await InstrumentService.create(updatedData);
				if (result) {
					toast.success('악기 정보가 등록되었습니다.');
					router.push(paths.instrument.list);
				} else {
					toast.error('악기 등록에 실패했습니다.');
				}
			}

			reset();
		} catch (error) {
			console.error('오류 발생:', error);
			toast.error('오류가 발생했습니다. 다시 시도해주세요.');
		}
	});







	return (
		<Form methods={methods} onSubmit={onSubmit}>
			<Stack spacing={{ xs: 3, md: 5 }} sx={{ mt: 3, mx: 'auto', maxWidth: { xs: 720, xl: 1200 } }}>
				<Card>
					<CardHeader title="기본 정보" subheader="" sx={{ mb: 1 }} />
					<Divider />
					<Stack spacing={3} sx={{ p: 3 }}>
						<Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }} >
							<Field.Text name="name" label="악기명" />
							<Field.Text name="display_order" label="노출 순서" type="number" />

							<Box sx={{ pl: '14px' }}>
								<Typography variant="subtitle2">선택전 썸네일</Typography><br />
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

							<Box sx={{ pl: '14px' }}>
								<Typography variant="subtitle2">선택후 썸네일</Typography><br />
								<Box>
									<input
										type="file"
										id="file2"
										key={selectedFiles[2] ? 'hasFile' : 'noFile'}
										style={{ display: 'none' }}
										onChange={(e) => {
											const file = e.target.files?.[0];
											if (file) {
												handleFileChange(2, e);
											}
										}}
									/>
									{typeof selectedFiles[2] === 'string' ? (
										<Box sx={{ mb: 2 }}>
											<img
												src={selectedFiles[2] as string}
												alt="이미지"
												style={{ maxWidth: '200px', maxHeight: '200px' }}
											/>
										</Box>
									) : selectedFiles[2] ? (
										selectedFiles[2]?.type.startsWith('image/') ? (
											<Box sx={{ mb: 2 }}>
												<img
													src={URL.createObjectURL(selectedFiles[2] as File)}
													alt="이미지"
													style={{ maxWidth: '200px', maxHeight: '200px' }}
												/>
											</Box>
										) : (
											<Box sx={{ mb: 2 }}>
												<a href={URL.createObjectURL(selectedFiles[2] as File)} download>
													다운로드 [{(selectedFiles[2] as File).name}]
												</a>
											</Box>
										)
									) : null}
									<Stack spacing={2} direction="row" alignItems="center">
										<Button
											variant="contained"
											component="label"
											htmlFor="file2"
										>
											파일 선택
										</Button>
										<Typography sx={{ flex: 1 }}>
											{selectedFileNames[2]}
										</Typography>
										{selectedFiles[2] && (
											<IconButton
												onClick={() => {
													const fileInput = document.getElementById('file2') as HTMLInputElement;
													if (fileInput) fileInput.value = '';

													setSelectedFiles(prev => ({ ...prev, 2: null }));
													setSelectedFileNames(prev => ({ ...prev, 2: '선택된 파일 없음' }));
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