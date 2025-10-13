import type { IMemberItem } from 'src/types/user';

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

import { Iconify } from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import MemberService from 'src/services/MemberService';
import { cl } from '@fullcalendar/core/internal-common';
import { CONFIG } from 'src/config-global';
// ----------------------------------------------------------------------

export type NewSchemaType = zod.infer<typeof NewSchema>;
export type EditSchemaType = zod.infer<typeof EditSchema>;



// 사용자의 데이터를 검증하는 스키마 - 각 필드에 대해 유효성 검사
export const NewSchema = zod.object({
	user_id: zod.string().min(3, { message: '아이디를 입력해 주세요' }),
	password: zod.string().min(4, { message: '비밀번호를 입력해 주세요' }),
	name: zod.string().min(2, { message: '이름을 입력해 주세요' }),

	/* Not required */
	// cellphone: schemaHelper.phoneNumber({ isValidPhoneNumber }),
	cellphone: zod.string(),
	nickname: zod.string(),
	type: zod.number(),
	login_type: zod.string(),
	login_ci_data: zod.string(),
	image_file: zod.string(),
	address1: zod.string(),
	address2: zod.string(),
	address3: zod.string(),
	zip: zod.string(),
	foreign_address: zod.string(),
	gender: zod.string(),
	school_name: zod.string(),
	grade: zod.string(),
	memo: zod.string(),
	zoom_link_url: zod.string(),
	voov_link_url: zod.string(),
	voov_link_exposed_members: zod.string(),
	parent_name: zod.string(),
	parent_cellphone: zod.string(),
	status: zod.number(),
	approve_date: zod.date(),
	leave_date: zod.date().nullable().optional(),
	leave_message: zod.string(),
	agree_marketing: zod.string(),
	notification_type: zod.string(),
	registration_source: zod.string(),
	last_login: zod.date().nullable().optional(),
	created_date: zod.date()
});

export const EditSchema = zod.object({
	user_id: zod.string().min(3, { message: '아이디를 입력해 주세요' }),
	name: zod.string().min(2, { message: '이름을 입력해 주세요' }),


	/* Not required */
	// cellphone: schemaHelper.phoneNumber({ isValidPhoneNumber }),
	password: zod.string(),
	cellphone: zod.string(),
	nickname: zod.string(),
	type: zod.number(),
	login_type: zod.string(),
	login_ci_data: zod.string(),
	image_file: zod.string(),
	address1: zod.string(),
	address2: zod.string(),
	address3: zod.string(),
	zip: zod.string(),
	foreign_address: zod.string(),
	gender: zod.string(),
	school_name: zod.string(),
	grade: zod.string(),
	memo: zod.string(),
	zoom_link_url: zod.string(),
	voov_link_url: zod.string(),
	voov_link_exposed_members: zod.string(),
	parent_name: zod.string(),
	parent_cellphone: zod.string(),
	status: zod.number(),
	approve_date: zod.date(),
	leave_date: zod.date().nullable().optional(),
	leave_message: zod.string(),
	agree_marketing: zod.string(),
	notification_type: zod.string(),
	registration_source: zod.string(),
	last_login: zod.date().nullable().optional(),
	created_date: zod.date()
});

// ----------------------------------------------------------------------

type Props = {
	currentUser?: IMemberItem;
};

export function NewEditForm({ currentUser }: Props) {
	const router = useRouter();

	// 폼의 초기값을 설정 - currentUser가 있으면 해당 유저의 데이터를 폼에 채우고, 없으면 기본값을 사용
	const defaultValues = useMemo(
		() => ({
			id: currentUser?.id || 0,
			type: currentUser?.type || 10,
			user_id: currentUser?.user_id || '',
			password: '',
			login_type: currentUser?.login_type || '이메일',
			login_ci_data: currentUser?.login_ci_data || '',
			name: currentUser?.name || '',
			image_file: currentUser?.image_file || '',
			nickname: currentUser?.nickname || '',
			cellphone: currentUser?.cellphone || '',
			address1: currentUser?.address1 || '',
			address2: currentUser?.address2 || '',
			address3: currentUser?.address3 || '',
			zip: currentUser?.zip || '',
			foreign_address: currentUser?.foreign_address || '',
			gender: currentUser?.gender || '남자',
			school_name: currentUser?.school_name || '',
			grade: currentUser?.grade || '',
			memo: currentUser?.memo || '',
			zoom_link_url: currentUser?.zoom_link_url || '',
			voov_link_url: currentUser?.voov_link_url || '',
			voov_link_exposed_members: currentUser?.voov_link_exposed_members || '',
			parent_name: currentUser?.parent_name || '',
			parent_cellphone: currentUser?.parent_cellphone || '',
			status: currentUser?.status || 20,
			approve_date: currentUser?.approve_date ? new Date(currentUser.approve_date) : new Date(),
			leave_date: currentUser?.leave_date ? new Date(currentUser.leave_date) : undefined,
			leave_message: currentUser?.leave_message || '',
			agree_marketing: currentUser?.agree_marketing || '동의',
			notification_type: currentUser?.notification_type || '이메일',
			registration_source: currentUser?.registration_source || '지인소개',
			last_login: currentUser?.last_login ? new Date(currentUser.last_login) : undefined,
			created_date: currentUser?.created_date ? new Date(currentUser.created_date) : new Date(),
		}),
		[currentUser]
	);

	// 유효성 검사 스키마를 동적으로 설정
	const validationSchema = useMemo(() => (currentUser ? EditSchema : NewSchema), [currentUser]);

	// react-hook-form을 사용해 폼을 설정
	const methods = useForm<NewSchemaType | EditSchemaType>({
		mode: 'onSubmit',
		// 등록, 수정에 맞는 폼 유효성 검사 실행
		resolver: zodResolver(validationSchema),
		defaultValues,
	});

	// console.log(methods.formState.errors);

	const frontUrl = import.meta.env.VITE_FRONT_URL;

	const {
		reset,
		watch,
		control,
		handleSubmit,
		formState: { isSubmitting },
	} = methods;

	useEffect(() => {
		if (currentUser) {
			reset(defaultValues);
		}
	}, [currentUser, defaultValues, reset]);

	const values = watch();




	// 폼 제출 시 호출 - 수정 API 또는 생성 API를 호출
	const onSubmit = handleSubmit(async (data: NewSchemaType) => {
		try {
			// 파일 업로드 처리.
			try {
				const uploadPromises = Object.entries(selectedFiles)
					.filter(([_, file]) => file !== null)
					.map(([_, file]) => {
						const formData = new FormData();
						formData.append('file', file!);
						return MemberService.addAttachment(formData);
					});

				const results = await Promise.all(uploadPromises);

				if (results.some(response => response.filename === '')) {
					alert('파일 업로드에 실패했습니다.');
					return;
				}
				const uploadedFiles = results.map(result => `${CONFIG.serverUrl}/uploads/${result.filename}`);
				// 위에 담긴 파일 경로 목록을 db 필드에 담아서 저장하면 됨

				// console.log(uploadedFiles);


			} catch (error) {
				console.error('파일 업로드 에러:', error);
				alert('파일 업로드에 실패했습니다.');
			}

			if (currentUser) {
				const result = await MemberService.update({
					...data,
					id: currentUser.id,
					leave_date: data.leave_date || undefined,
					last_login: data.last_login || undefined,
				});
				if (result === 'success') {
					toast.success('회원 정보가 수정되었습니다.');
					router.push(paths.member.list);
				} else {
					toast.error('회원 수정에 실패했습니다.');
				}


			} else {
				const result = await MemberService.create({
					...methods.getValues(),
					leave_date: undefined,
					last_login: undefined
				});
				if (result) {
					toast.success('회원 정보가 등록되었습니다.');
					router.push(paths.member.list);
				} else {
					toast.error('회원 등록에 실패했습니다.');
				}
			}


			reset();
		} catch (error) {
			console.error(error);
			toast.error('오류가 발생했습니다. 다시 시도해주세요.');
		}
	});

	const deleteMember = useCallback(async (id?: number) => {
		if (id) {
			MemberService.delete(id).then((value) => {
				toast.success('해당 유저 정보를 삭제하였습니다.');
				router.push(paths.member.list);
			});
		}
	}, [router]);

	const [selectedFiles, setSelectedFiles] = useState<{ [key: number]: File | null }>({
		1: null,
		2: null,
		3: null
	});

	const [selectedFileNames, setSelectedFileNames] = useState<{ [key: number]: string }>({
		1: '선택된 파일 없음',
		2: '선택된 파일 없음',
		3: '선택된 파일 없음'
	});



	// {/* 폼 컴포넌트 정리

	// 	// 서브타이틀 표시
	// 	<Typography variant="subtitle2">Title</Typography>


	// 	// 체크박스, 라디오박스
	// 	const NOTIFICATION_TYPE_OPTIONS = [
	// 		{ label: '이메일', value: '이메일' },
	// 		{ label: '카카오알림톡', value: '카카오알림톡' },
	// 	];
	// 	// 체크박스
	// 	<Field.MultiCheckbox
	// 		row
	// 		name="notification_type"
	// 		options={NOTIFICATION_TYPE_OPTIONS}
	// 		sx={{ gap: 4 }}
	// 	/> 

	// 	// 라디오박스
	// 	<Field.RadioGroup
	// 		row
	// 		name="notification_type"
	// 		options={NOTIFICATION_TYPE_OPTIONS}
	// 		sx={{ gap: 4 }}
	// 	/>


	// 	// 멀티 드롭다운
	// 	const JOB_SKILL_OPTIONS = [
	// 		'UI',
	// 		'UX',
	// 		'Html',
	// 		'JavaScript',
	// 		'TypeScript',
	// 		'Communication',
	// 		'Problem Solving',
	// 		'Leadership',
	// 		'Time Management',
	// 		'Adaptability',
	// 		'Collaboration',
	// 		'Creativity',
	// 		'Critical Thinking',
	// 		'Technical Skills',
	// 		'Customer Service',
	// 		'Project Management',
	// 		'Problem Diagnosis',
	// 	];
	// 	<Field.Autocomplete
	// 		name="skills"
	// 		placeholder="+ Skills"
	// 		autoHighlight
	// 		multiple
	// 		disableCloseOnSelect
	// 		options={JOB_SKILL_OPTIONS.map((option) => option)}
	// 		getOptionLabel={(option) => option}
	// 		renderOption={(props, option) => (
	// 			<li {...props} key={option}>
	// 				{option}
	// 			</li>
	// 		)}
	// 		renderTags={(selected, getTagProps) =>
	// 			selected.map((option, index) => (
	// 				<Chip
	// 					{...getTagProps({ index })}
	// 					key={option}
	// 					label={option}
	// 					size="small"
	// 					color="success"
	// 					variant="soft"
	// 				/>
	// 			))
	// 		}
	// 	/>

	// // 드롭다운 객체 사용
	// <Autocomplete
	// 	options={memberList}
	// 	autoHighlight
	// 	getOptionLabel={(option) => `${option.name} (${option.user_id})`}
	// 	isOptionEqualToValue={(option, value) => option.id === value.id} // 값 비교 기준
	// 	value={selectedMember} // 현재 선택된 값
	// 	onChange={(event, newValue) => {
	// 		setSelectedMember(newValue || null); // 선택된 객체 저장
	// 	}}
	// 	renderInput={(params) => (
	// 		<TextField {...params} label="회원 선택" placeholder="회원 선택" />
	// 	)}
	// />

	// 	// TEXTAREA
	// 	<Field.Text name="user_id" multiline rows={4} label="user_id" />

	// 	// TEXTAREA editor
	// 	<Field.Editor name="content" sx={{ maxHeight: 480 }} />

	// 	*/}

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



	return (
		<Form methods={methods} onSubmit={onSubmit}>
			<Stack spacing={{ xs: 3, md: 5 }} sx={{ mt: 3, mx: 'auto', maxWidth: { xs: 720, xl: 1200 } }}>
				<Card>
					<CardHeader
						title="기본 정보"
						subheader="" sx={{ mb: 1 }}
						action={currentUser &&
							<a href={`${frontUrl}/auth/admin/${currentUser?.user_id}`} target="_blank" rel="noreferrer">
								<Button variant="soft" color="info" sx={{ fontSize: '13px', fontWeight: 900 }}>
									회원으로 로그인
								</Button>
							</a>
						}
					/>
					<Divider />
					<Stack spacing={3} sx={{ p: 3 }}>
						<Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }} >
							<Field.Text name="user_id" label="아이디" />
							{/* <Field.Text name="user_id" label="아이디" disabled={!!currentUser} /> */}
							<Field.Text name="password" label={currentUser ? "비밀번호 변경" : "비밀번호"} type="password" />
							<Field.Text name="name" label="이름" />
							<Field.Text name="cellphone" label="연락처" />
							<Field.Select name='gender' size="medium" label="성별" InputLabelProps={{ shrink: true }}>
								<MenuItem value='남자'>남자</MenuItem>
								<MenuItem value='여자'>여자</MenuItem>
							</Field.Select>
						</Box>
						<Divider />
						<Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }} >
							<Field.Text name="address1" label="주소" />
							{/* <Field.Text name="address2" label="상세주소" />
							<Field.Text name="zip" label="우편번호" />
							<Field.Text name="foreign_address" label="외국주소" /> */}
							{/* <Field.Editor name="voov_link_exposed_members" sx={{ maxHeight: 480 }} /> */}

							{/* <Stack spacing={2}>
								<Typography variant="subtitle2">이미지업로드, 파일업로드</Typography><br />
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
									{selectedFiles[1]?.type.startsWith('image/') ? (
										<Box sx={{ mb: 2 }}>
											<img
												src={URL.createObjectURL(selectedFiles[1])}
												alt="이미지"
												style={{ maxWidth: '200px', maxHeight: '200px' }}
											/>
										</Box>
									) : (
										selectedFiles[1] && (
											<Box sx={{ mb: 2 }}>
												<a href={URL.createObjectURL(selectedFiles[1])} download>
													다운로드 [{selectedFiles[1].name}]
												</a>
											</Box>
										)
									)}
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
									{selectedFiles[2]?.type.startsWith('image/') ? (
										<Box sx={{ mb: 2 }}>
											<img
												src={URL.createObjectURL(selectedFiles[2])}
												alt="이미지"
												style={{ maxWidth: '200px', maxHeight: '200px' }}
											/>
										</Box>
									) : (
										selectedFiles[2] && (
											<Box sx={{ mb: 2 }}>
												<a href={URL.createObjectURL(selectedFiles[2])} download>
													다운로드 [{selectedFiles[2].name}]
												</a>
											</Box>
										)
									)}
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

								<Box>
									<input
										type="file"
										id="file3"
										key={selectedFiles[3] ? 'hasFile' : 'noFile'}
										style={{ display: 'none' }}
										onChange={(e) => {
											const file = e.target.files?.[0];
											if (file) {
												handleFileChange(3, e);
											}
										}}
									/>
									{selectedFiles[3]?.type.startsWith('image/') ? (
										<Box sx={{ mb: 2 }}>
											<img
												src={URL.createObjectURL(selectedFiles[3])}
												alt="이미지"
												style={{ maxWidth: '200px', maxHeight: '200px' }}
											/>
										</Box>
									) : (
										selectedFiles[3] && (
											<Box sx={{ mb: 2 }}>
												<a href={URL.createObjectURL(selectedFiles[3])} download>
													다운로드 [{selectedFiles[3].name}]
												</a>
											</Box>
										)
									)}
									<Stack spacing={2} direction="row" alignItems="center">
										<Button
											variant="contained"
											component="label"
											htmlFor="file3"
										>
											파일 선택
										</Button>
										<Typography sx={{ flex: 1 }}>
											{selectedFileNames[3]}
										</Typography>
										{selectedFiles[3] && (
											<IconButton
												onClick={() => {
													const fileInput = document.getElementById('file3') as HTMLInputElement;
													if (fileInput) fileInput.value = '';

													setSelectedFiles(prev => ({ ...prev, 3: null }));
													setSelectedFileNames(prev => ({ ...prev, 3: '선택된 파일 없음' }));
												}}
											>
												<Iconify icon="mdi:delete" />
											</IconButton>
										)}
									</Stack>
								</Box>
							</Stack> */}
							{/* <Field.Upload
            multiple
            thumbnail
            name="image_file"
            maxSize={3145728}
            onRemove={handleRemoveFile}
            onRemoveAll={handleRemoveAllFiles}
            onUpload={() => console.info('ON UPLOAD')}
          />
							<Field.Upload
            multiple
            thumbnail
            name="image_file"
            maxSize={3145728}
            onRemove={handleRemoveFile}
            onRemoveAll={handleRemoveAllFiles}
            onUpload={() => console.info('ON UPLOAD')}
          /> */}

						</Box>
					</Stack>
				</Card>


				<Card>
					<CardHeader title="추가 정보 " subheader="" sx={{ mb: 1 }} />
					<Divider />
					<Stack spacing={3} sx={{ p: 3 }}>
						<Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }} >
							<Field.Text name="school_name" label="학교명" />
							<Field.Text name="grade" label="학년" />
							<Field.Text name="parent_name" label="부모님 이름" />
							<Field.Text name="parent_cellphone" label="부모님 휴대폰번호" />
							<Field.Text name="memo" label="참고사항" />
						</Box>
					</Stack>
				</Card>


				<Card>
					<CardHeader title="계정 정보" subheader="" sx={{ mb: 1 }} />
					<Divider />
					<Stack spacing={3} sx={{ p: 3 }}>
						<Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }} >

							<Field.Select name="status"
								size="medium"
								label="회원 상태"
								InputLabelProps={{ shrink: true }}
								onChange={(e) => {
									const value = Number(e.target.value);
									methods.setValue("status", value);
									if (value === 20) {
										methods.setValue("approve_date", new Date());
									}
								}}
							>
								<MenuItem value={20}>활동</MenuItem>
								<MenuItem value={40}>탈퇴</MenuItem>
							</Field.Select><br />

							<Field.Select name='registration_source' size="medium" label="가입 경로" InputLabelProps={{ shrink: true }}>
								<MenuItem value='지인소개'>지인소개</MenuItem>
								<MenuItem value='인스타그램'>인스타그램</MenuItem>
								<MenuItem value='페이스북'>페이스북</MenuItem>
								<MenuItem value='인터넷검색'>인터넷검색</MenuItem>
								<MenuItem value='블로그'>블로그</MenuItem>
								<MenuItem value='기타'>기타</MenuItem>
							</Field.Select>

							<Field.Select name='login_type' size="medium" label="로그인 타입" InputLabelProps={{ shrink: true }}>
								<MenuItem value='이메일'>이메일</MenuItem>
								<MenuItem value='카카오'>카카오</MenuItem>
								<MenuItem value='네이버'>네이버</MenuItem>
							</Field.Select>

							<Field.Select name='notification_type' size="medium" label="알림 설정" InputLabelProps={{ shrink: true }}>
								<MenuItem value='이메일'>이메일</MenuItem>
								<MenuItem value='카카오알림톡'>카카오알림톡</MenuItem>
							</Field.Select>

							<Field.Select name='agree_marketing' size="medium" label="마케팅 동의" InputLabelProps={{ shrink: true }}>
								<MenuItem value='동의'>동의</MenuItem>
								<MenuItem value='미동의'>미동의</MenuItem>
							</Field.Select>


							<Field.Text
								name="last_login"
								label="최근 접속일"
								value={currentUser?.last_login ? new Date(currentUser.last_login).toLocaleDateString('ko-KR', {
									year: 'numeric',
									month: 'long',
									day: 'numeric',
									hour: '2-digit',
									minute: '2-digit'
								}) : ''}
								disabled
							/>
							<Field.Text
								name="created_date"
								label="생성일"
								value={currentUser?.created_date ? new Date(currentUser.created_date).toLocaleDateString('ko-KR', {
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
						{!currentUser ? '등록 완료' : '수정 완료'}
					</LoadingButton>
				</Stack>


			</Stack>
		</Form >
	);
}