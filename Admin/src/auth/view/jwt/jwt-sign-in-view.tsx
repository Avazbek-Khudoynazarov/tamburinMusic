import { z as zod } from 'zod';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';
import AuthService from 'src/services/AuthService';
import MemberService from 'src/services/MemberService';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from '../../hooks';
import { FormHead } from '../../components/form-head';
import { signInWithPassword } from '../../context/jwt';
import useGlobalStore from '../../../stores/globalStore';
// ----------------------------------------------------------------------

export type SignInSchemaType = zod.infer<typeof SignInSchema>;

export const SignInSchema = zod.object({
	admin_id: zod
		.string()
		.min(1, { message: '아이디를 입력해주세요!' }),
	// .email({ message: 'Email must be a valid email address!' }),
	password: zod
		.string()
		.min(1, { message: '비밀번호를 입력해주세요!' })
		.min(6, { message: '비밀번호는 최소 6자 이상입력해주세요!' }),
});

// ----------------------------------------------------------------------

export function JwtSignInView() {
	const { setAuthenticated, setAdmin } = useGlobalStore();
	const navigate = useNavigate();

	const router = useRouter();

	const { checkUserSession } = useAuthContext();

	// Admin authentication bypass for local development
	const requireAdminAuth = import.meta.env.VITE_REQUIRE_ADMIN_AUTH !== 'false';

	const [authCode, setAuthCode] = useState('');

	const [errorMsg, setErrorMsg] = useState('');

	const password = useBoolean();

	const defaultValues = {
		email: '',
		admin_id: '',
		password: '',
	};

	const methods = useForm<SignInSchemaType>({
		resolver: zodResolver(SignInSchema),
		defaultValues,
	});

	const {
		handleSubmit,
		formState: { isSubmitting },
	} = methods;




	const onSubmit = handleSubmit(async (data) => {
		try {

			// Skip email verification if admin auth is disabled
			if (requireAdminAuth) {
				if (!authCode || authCode.length !== 6) {
					alert('올바른 인증번호를 입력해주세요.');
					return;
				}

				const result = await MemberService.verificateMail('classictalk@naver.com', authCode);
				if (result && result.length > 0 && result[0].id) {
					await MemberService.certifyMail(result[0]);
				} else {
					alert("올바른 인증번호를 입력해주세요.");
					return;
				}
			}

			// Proceed with login (with or without email verification)
			AuthService.login(data.admin_id, data.password).then((resultData: any) => {
				if (resultData.type !== "success") {
					setErrorMsg(resultData.message);
				} else {
					setAdmin(resultData.admin);
					setAuthenticated(true);
					setErrorMsg('');
					navigate("/");
				}
			});




			// await signInWithPassword({ email: data.email, password: data.password });
			// await checkUserSession?.();

			// router.refresh();
		} catch (error) {
			console.error(error);
			setErrorMsg(typeof error === 'string' ? error : error.message);
		}
	});


	const sendEmail = async () => {

		alert('메일이 발송 되었습니다. \n인증 메일을 확인해주세요.');

		const now = new Date();
		const nowDate = now;

		const year = now.getFullYear();
		const month = String(now.getMonth() + 1).padStart(2, '0');
		const day = String(now.getDate()).padStart(2, '0');
		const hours = String(now.getHours()).padStart(2, '0');
		const minutes = String(now.getMinutes()).padStart(2, '0');
		const seconds = String(now.getSeconds()).padStart(2, '0');
		// 형식에 맞춰 문자열로 조합
		const formattedDate = `${year}년 ${month}월 ${day}일 ${hours}:${minutes}:${seconds}`;

		const futureDate = new Date(now);
		futureDate.setMinutes(now.getMinutes() + 10);


		const randomSixDigitNumber = Math.floor(Math.random() * 900000) + 100000;


		await MemberService.sendEmail({
			email: 'classictalk@naver.com',
			subject: '[탬버린뮤직] 관리자 로그인 인증번호 입니다.',
			type: '관리자로그인',
			token: randomSixDigitNumber,
			content: `<table align="center" width="780px" border="0" cellpadding="0" cellspacing="0">
	<tbody>
	<tr>
		<td style="background:#fff; padding:30px 0 40px 30px; border-top:1px solid #b6b6b6; border-left:1px solid #b6b6b6; border-right:1px solid #b6b6b6; font-family:dotum, sans-serif; line-height:22px; color:#666;">
			 안녕하세요. 탬버린 뮤직 입니다. <br>
			<span style="color:#d00000;">탬버린 뮤직(tamburinmusic.com)</span>의 안전한 이용을 위해 관리자 이메일 인증을 진행합니다. <br>
			<br>
			아래 인증번호를 <span style="color:#f26522;font-weight:bold">입력하여</span> 인증을 완료해 주세요. <br>
			개인정보보호를 위해 발송된 <span style="color:#f26522;font-weight:bold">인증번호는 10분간 유효</span>합니다.
		</td>
	</tr>
	<tr>
		<td style=" background:#fff; padding-left:30px; border-left:1px solid #b6b6b6; border-right:1px solid #b6b6b6;">
			<table width="718" border="0" cellspacing="0" cellpadding="0" summary="인증번호 안내">
			<tbody>
			<tr>
				<td height="3" colspan="2" style="background:#333;">
				</td>
			</tr>
			<tr>
				<td align="center" width="150" height="38" style="background:#f7f7f7;font-family:dotum, sans-serif; font-size:12px; color:#111; font-weight:bold">
					인증번호
				</td>
				<td style="padding-left:20px; font-family:dotum, sans-serif; font-size:15px; color:#111; font-weight:bold">
					${randomSixDigitNumber}
				</td>
			</tr>
			<tr>
				<td height="1" colspan="2" style="background:#d2d2d2;">
				</td>
			</tr>
			<tr>
				<td align="center" height="38" style="background:#f7f7f7;font-family:dotum, sans-serif; font-size:12px; color:#111;font-weight:bold">
					발급시간
				</td>
				<td style="padding-left:20px; font-family:dotum, sans-serif; font-size:12px; color:#d00000;font-weight:bold">
					${formattedDate}
				</td>
			</tr>
			<tr>
				<td height="2" colspan="2" style="background:#d2d2d2;">
				</td>
			</tr>
			</tbody>
			</table>
		</td>
	</tr>
	<tr>
		<td style="background:#fff; padding:40px 0 20px 30px; border-left:1px solid #b6b6b6; border-right:1px solid #b6b6b6;border-bottom:1px solid #b6b6b6;  font-family:dotum, sans-serif; font-size:11px; color:#333; line-height:22px; ">
			 본 메일은 발신전용으로 회신되지 않습니다. 
		</td>
	</tr>
	</tbody>
	<!--footer-->
	</table>`
		});

	};



	const renderForm = (
		<Box gap={3} display="flex" flexDirection="column">
			<Field.Text name="admin_id" label="ID" InputLabelProps={{ shrink: true }} />

			<Box gap={1.5} display="flex" flexDirection="column">
				<Field.Text
					name="password"
					label="Password"
					placeholder="6+ characters"
					type={password.value ? 'text' : 'password'}
					InputLabelProps={{ shrink: true }}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<IconButton onClick={password.onToggle} edge="end">
									<Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
								</IconButton>
							</InputAdornment>
						),
					}}
				/>
			</Box>

			{requireAdminAuth && (
				<Box gap={1.5} display="flex" flexDirection="row">

					<Field.Text
						name="auth_code"
						label="인증 번호"
						InputLabelProps={{ shrink: true }}
						onChange={(e) => setAuthCode(e.target.value)}
					/>


					<LoadingButton
						fullWidth
						color="inherit"
						size="large"
						type="button"
						variant="contained"
						onClick={sendEmail}
					>
						인증번호 발송
					</LoadingButton>
				</Box>
			)}

			{!requireAdminAuth && (
				<Alert severity="warning" sx={{ mb: 2 }}>
					🔓 개발 모드: 이메일 인증이 비활성화되었습니다.
				</Alert>
			)}


			<LoadingButton
				fullWidth
				color="inherit"
				size="large"
				type="submit"
				variant="contained"
				loading={isSubmitting}
				loadingIndicator="로그인 중입니다..."
			>
				로그인
			</LoadingButton>
		</Box>
	);

	return (
		<>
			<Box
				sx={{
					marginTop: '-10vh',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					minHeight: '100vh',
					bgcolor: 'background.default',
				}}
			>
				<Box
					sx={{
						maxWidth: 400,
						width: '100%',
						margin: '0 auto',
						padding: { xs: 3, md: 4 },
						borderRadius: 2,
						bgcolor: 'background.paper',
						boxShadow: (theme) => theme.shadows[24],
					}}
				>
					<FormHead
						title="로그인을 해주세요."
						description={null}
						sx={{ textAlign: { xs: 'center', md: 'left' } }}
					/>

					{!!errorMsg && (
						<Alert severity="error" sx={{ mb: 3 }}>
							{errorMsg}
						</Alert>
					)}

					<Form methods={methods} onSubmit={onSubmit}>
						{renderForm}
					</Form>
				</Box>
			</Box>
		</>
	);
}

