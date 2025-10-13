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
			notification_type: currentUser?.notification_type || '카카오알림톡',
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

	const frontUrl = import.meta.env.VITE_FRONT_URL;

	// console.log(methods.formState.errors);

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

			if (currentUser) {
				const result = await MemberService.update({
					...data,
					id: currentUser.id,
					leave_date: data.leave_date || undefined,
					last_login: data.last_login || undefined,
				});
				if (result === 'success') {
					toast.success('강사 정보가 수정되었습니다.');
					router.push(paths.teacher.list);
				} else {
					toast.error('강사 수정에 실패했습니다.');
				}


			} else {
				const result = await MemberService.create({
					...methods.getValues(),
					type: 20,
					leave_date: undefined,
					last_login: undefined
				});
				if (result) {
					toast.success('강사 정보가 등록되었습니다.');
					router.push(paths.teacher.list);
				} else {
					toast.error('강사 등록에 실패했습니다.');
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
				router.push(paths.teacher.list);
			});
		}
	}, [router]);






	return (
		<Form methods={methods} onSubmit={onSubmit}>
			<Stack spacing={{ xs: 3, md: 5 }} sx={{ mt: 3, mx: 'auto', maxWidth: { xs: 720, xl: 1200 } }}>
				<Card>
					<CardHeader
						title="기본 정보"
						subheader="" sx={{ mb: 1 }}
						action={
							<a href={`${frontUrl}/auth/admin/${currentUser?.user_id}`} target="_blank" rel="noreferrer">
								<Button variant="soft" color="info" sx={{ fontSize: '13px', fontWeight: 900 }}>
									강사로 로그인
								</Button>
							</a>
						}
					/>
					<Divider />
					<Stack spacing={3} sx={{ p: 3 }}>
						<Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }} >
							<Field.Text name="user_id" label="아이디" disabled={!!currentUser} />
							<Field.Text name="password" label={currentUser ? "비밀번호 변경" : "비밀번호"} type="password" />
							<Field.Text name="name" label="이름" />
							<Field.Text name="cellphone" label="연락처" />

							<Field.Select name="status"
								size="medium"
								label="강사 상태"
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
