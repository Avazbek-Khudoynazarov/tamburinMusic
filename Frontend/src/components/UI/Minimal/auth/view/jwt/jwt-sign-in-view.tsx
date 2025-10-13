import { z as zod } from 'zod';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from '@/components/UI/Minimal/routes/paths';
import { useRouter } from '@/components/UI/Minimal/routes/hooks';
import { RouterLink } from '@/components/UI/Minimal/routes/components';

import { useBoolean } from '@/components/UI/Minimal/hooks//use-boolean';
import AuthService from '@/services/AuthService';

import { Iconify } from '@/components/UI/Minimal/components/iconify';
import { Form, Field } from '@/components/UI/Minimal/components/hook-form';

import { useAuthContext } from '../../hooks';
import { FormHead } from '../../components/form-head';
import { signInWithPassword } from '../../context/jwt';
import useGlobalStore from '../../../stores/globalStore';
// ----------------------------------------------------------------------

export type SignInSchemaType = zod.infer<typeof SignInSchema>;

export const SignInSchema = zod.object({
  admin_id: zod
    .string()
    .min(1, { message: 'ID is required!' }),
    // .email({ message: 'Email must be a valid email address!' }),
  password: zod
    .string()
    .min(1, { message: 'Password is required!' })
    .min(6, { message: 'Password must be at least 6 characters!' }),
});

// ----------------------------------------------------------------------

export function JwtSignInView() {
  const { setAuthenticated, setAdmin } = useGlobalStore();
  const navigate = useNavigate();

  const router = useRouter();

  const { checkUserSession } = useAuthContext();

  const [errorMsg, setErrorMsg] = useState('');

  const password = useBoolean();

  const defaultValues = {
    email: 'test@naver.com',
    admin_id: 'admin',
    password: 'abc1234!!',
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
      if (!data.admin_id) {
        setErrorMsg('아이디를 입력하세요.');
        return;
      }
      if (!data.password) {
        setErrorMsg('비밀번호를 입력하세요.');
        return;
      }
  
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

