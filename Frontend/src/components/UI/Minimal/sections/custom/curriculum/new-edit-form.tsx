import type { IMemberItem, IInstrumentItem, ICurriculumItem } from '@/components/UI/Minimal/types/user';

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
import { useRouter } from '@/components/UI/Minimal/routes/hooks';

import { fData } from '@/utils/format-number';

import { Label } from '@/components/UI/Minimal/components/label';
import { toast } from '@/components/UI/Minimal/components/snackbar';
import { Form, Field, schemaHelper } from '@/components/UI/Minimal/components/hook-form';

import ClassesService from '@/services/ClassesService';
import MemberService from '@/services/MemberService';
import InstrumentService from '@/services/InstrumentService';
import CurriculumService from '@/services/CurriculumService';
import MetaService from '@/services/MetaService';

import * as CONFIG from '@/config';
// ----------------------------------------------------------------------

export type NewSchemaType = zod.infer<typeof NewSchema>;
export type EditSchemaType = zod.infer<typeof EditSchema>;


export const NewSchema = zod.object({
	instrument_id: zod.number(),
	months: zod.number(),
	weekly_classes: zod.number(),
	total_classes: zod.number(),
	name: zod.string().min(2, { message: '커리큘럼명을 입력해 주세요' }),
	price: zod.number(),
	instrument_price: zod.number(),
	instrument_rental_fee: zod.number(),
	instrument_discount: zod.number(),
	image_file: zod.string(),
	additional_text: zod.string(),
	text1: zod.string(),
	text2: zod.string(),
	text3: zod.string(),
	is_deleted: zod.string(),
	created_date: zod.date(),
	instrument: zod.object({
		id: zod.number().optional(),
		name: zod.string().optional(),
		image_file1: zod.string().optional(),
		image_file2: zod.string().optional(),
		display_order: zod.number().optional(),
		is_deleted: zod.string().optional(),
		created_date: zod.date().optional(),
	}),
});

export const EditSchema = NewSchema.extend({ id: zod.number() });

// ----------------------------------------------------------------------

type Props = {
	currentItem?: ICurriculumItem;
};

export function NewEditForm({ currentItem }: Props) {
	const router = useRouter();

	// 폼의 초기값을 설정 - currentItem가 있으면 해당 유저의 데이터를 폼에 채우고, 없으면 기본값을 사용
	const defaultValues = useMemo(() => {
		let decodedText = { text1: '', text2: '', text3: '' };

		if (
			currentItem?.additional_text &&
			currentItem.additional_text.startsWith('{') &&
			currentItem.additional_text.endsWith('}')
		) {
			try {
				decodedText = JSON.parse(currentItem.additional_text);
			} catch (error) {
				console.error('Failed to parse additional_text:', error);
			}
		}

		return {
			id: currentItem?.id || 0,
			instrument_id: currentItem?.instrument_id || 0,
			months: currentItem?.months || 1,
			weekly_classes: currentItem?.weekly_classes || 1,
			total_classes: currentItem?.total_classes || 1,
			name: currentItem?.name || '',
			price: currentItem?.price || 0,
			instrument_price: currentItem?.instrument_price || 0,
			instrument_rental_fee: currentItem?.instrument_rental_fee || 0,
			instrument_discount: currentItem?.instrument_discount || 0,
			image_file: currentItem?.image_file || '',
			additional_text: currentItem?.additional_text || '',
			text1: decodedText.text1 || '',
			text2: decodedText.text2 || '',
			text3: decodedText.text3 || '',
			is_deleted: currentItem?.is_deleted || 'N',
			created_date: currentItem?.created_date ? new Date(currentItem.created_date) : new Date(),
			instrument: currentItem?.instrument || {
				id: 0,
				name: '',
				image_file1: '',
				image_file2: '',
				display_order: 0,
				is_deleted: 'N',
				created_date: new Date(),
			},
		};
	}, [currentItem]);
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


	// 악기 리스트
	const [instrumentList, setInstrumentList] = useState<IInstrumentItem[]>([]);




	const loadInitialData = useCallback(async () => {
		const list = await InstrumentService.getAllList();
		if (list) {
			setInstrumentList(list);
		}
	}, []);


	useEffect(() => {
		loadInitialData();
	}, [loadInitialData]);






	const [selectedFiles, setSelectedFiles] = useState<{ [key: number]: File | string | null }>({
		1: null,
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
		3: '선택된 파일 없음'
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

	const onSubmit = handleSubmit(async (data: NewSchemaType | EditSchemaType) => {
		try {
			const uploadResults: { [key: number]: string } = {};
	
			// 파일 업로드 처리
			try {
				const uploadPromises = Object.entries(selectedFiles)
					.filter(([_, file]) => file instanceof File) // File 타입만 업로드
					.map(async ([key, file]) => {
						const formData = new FormData();
						formData.append('file', file as File);
						const result = await CurriculumService.addAttachment(formData);
						if (result.filename) {
							uploadResults[Number(key)] = `${import.meta.env.VITE_SERVER_URL}/${result.path.replace(/\\/g, '/')}`;
						}
					});
	
				await Promise.all(uploadPromises);
	
				// 업로드된 파일 경로를 데이터에 반영
				data.image_file = uploadResults[1] || (typeof selectedFiles[1] === 'string' ? (selectedFiles[1] as string) : '');
			} catch (error) {
				console.error('파일 업로드 에러:', error);
				alert('파일 업로드에 실패했습니다.');
				return;
			}
	
			// additional_text 필드 생성
			const additionalText = JSON.stringify({
				text1: data.text1,
				text2: data.text2,
				text3: data.text3,
			});
	
			// 필요한 필드만 추출
			const payload: ICurriculumItem = {
				id: currentItem?.id, // 수정 시 ID 추가
				instrument_id: data.instrument_id,
				months: data.months,
				weekly_classes: data.weekly_classes,
				total_classes: data.total_classes,
				name: data.name,
				price: data.price,
				instrument_price: data.instrument_price,
				instrument_rental_fee: data.instrument_rental_fee,
				instrument_discount: data.instrument_discount,
				image_file: data.image_file,
				additional_text: additionalText,
				is_deleted: data.is_deleted || 'N',
				created_date: data.created_date || new Date(),
			};
	
			// 수정 또는 생성 API 호출
			if (currentItem) {
				const result = await CurriculumService.update(payload);
				if (result === 'success') {
					toast.success('커리큘럼 정보가 수정되었습니다.');
					router.push(paths.curriculum.list);
				} else {
					toast.error('커리큘럼 수정에 실패했습니다.');
				}
			} else {
				const result = await CurriculumService.create(payload);
				if (result) {
					toast.success('커리큘럼 정보가 등록되었습니다.');
					router.push(paths.curriculum.list);
				} else {
					toast.error('커리큘럼 등록에 실패했습니다.');
				}
			}
	
			// 폼 초기화
			reset();
		} catch (error) {
			console.error(error);
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
						<Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}>
							<Field.Select name="instrument_id" size="medium" label="악기" InputLabelProps={{ shrink: true }}>
								{instrumentList.map((instrument) => (
									<MenuItem key={instrument.id} value={instrument.id}>
										{instrument.name}
									</MenuItem>
								))}
							</Field.Select>
							<Field.Text name="name" label="커리큘럼명" />
							<Field.Text name="price" label="금액"
								onChange={(e) => {
									const value = e.target.value.replace(/[^0-9]/g, '');
									methods.setValue('price', value ? Number(value) : 0);
								}}
								value={values.price}
							/>
						</Box>
						<Divider />
						<Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}>
							<Field.Text name="instrument_price" label="악기구입비"
								onChange={(e) => {
									const value = e.target.value.replace(/[^0-9]/g, '');
									methods.setValue('instrument_price', value ? Number(value) : 0);
								}}
								value={values.instrument_price}
							/>
							<Field.Text name="instrument_rental_fee" label="악기대여비"
								onChange={(e) => {
									const value = e.target.value.replace(/[^0-9]/g, '');
									methods.setValue('instrument_rental_fee', value ? Number(value) : 0);
								}}
								value={values.instrument_rental_fee}
							/>
							<Field.Text name="instrument_discount" label="악기보유 시 할인금액"
								onChange={(e) => {
									const value = e.target.value.replace(/[^0-9]/g, '');
									methods.setValue('instrument_discount', value ? Number(value) : 0);
								}}
								value={values.instrument_discount}
							/>
						</Box>
						<Divider />
						<Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}>
							<Field.Text name="months" label="개월 수"
								onChange={(e) => {
									const value = e.target.value.replace(/[^0-9]/g, '');
									methods.setValue('months', value ? Number(value) : 0);
								}}
								value={values.months}
							/>
							<Field.Text name="weekly_classes" label="주별 수업횟수"
								onChange={(e) => {
									const value = e.target.value.replace(/[^0-9]/g, '');
									methods.setValue('weekly_classes', value ? Number(value) : 0);
								}}
								value={values.weekly_classes}
							/>
							<Field.Text name="total_classes" label="수업횟수"
								onChange={(e) => {
									const value = e.target.value.replace(/[^0-9]/g, '');
									methods.setValue('total_classes', value ? Number(value) : 0);
								}}
								value={values.total_classes}
							/><br />

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
						</Box>
					</Stack>
				</Card>

				<Card>
					<CardHeader title="추가 정보" subheader="" sx={{ mb: 1 }} />
					<Divider />
					<Stack spacing={3} sx={{ p: 3 }}>
						<Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}>
							<Field.Text name="text1" label="악기노출문구" />
							<Field.Text name="text2" label="노출문구" />
							<Field.Text name="text3" label="할인률" />
						</Box>
						<Divider />
						<Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}>
							<Field.Text
								name="created_date"
								label="생성일"
								value={
									currentItem?.created_date
										? new Date(currentItem.created_date).toLocaleDateString('ko-KR', {
											year: 'numeric',
											month: 'long',
											day: 'numeric',
											hour: '2-digit',
											minute: '2-digit',
										})
										: ''
								}
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
		</Form>
	);

}