import type { IUserItem } from 'src/types/user';

import { z as zod } from 'zod';
import { useCallback, useEffect, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
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
// ----------------------------------------------------------------------

export type NewUserSchemaType = zod.infer<typeof NewUserSchema>;

export const NewUserSchema = zod.object({
  type: zod.number(),
  user_id: zod.string().min(1, { message: 'User ID is required!' }),
  /* email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }), */
  password: zod.string().min(1, { message: 'Password is required!' }),
  login_type: zod.string().min(1, { message: 'Login type is required!' }),
  login_ci_data: zod.string().min(1, { message: 'Login CI data is required!' }),
  name: zod.string().min(1, { message: 'Name is required!' }),
  nickname: zod.string().min(1, { message: 'Nickname is required!' }),
  cellphone: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  image_file: zod.string(),
  // imageFileUrl: schemaHelper.file({ message: { required_error: 'Avatar is required!' } }),
  address1: zod.string().min(1, { message: 'Address is required!' }),
  address2: zod.string().min(1, { message: 'Address is required!' }),
  address3: zod.string().min(1, { message: 'Address is required!' }),
  zip: zod.string().min(1, { message: 'Zip code is required!' }),
  foreign_address: zod.string().min(1, { message: 'Foreign address is required!' }),
  gender: zod.string().min(1, { message: 'Gender is required!' }),
  school_name: zod.string().min(1, { message: 'School name is required!' }),
  grade: zod.string().min(1, { message: 'Grade is required!' }),
  memo: zod.string().min(1, { message: 'Memo is required!' }),
  zoom_link_url: zod.string().min(1, { message: 'Zoom link is required!' }),
  voov_link_url: zod.string().min(1, { message: 'Voov link is required!' }),
  // voov_link_exposed_members: zod.array(zod.string()),
  voov_link_exposed_members: zod.string(),
  parent_name: zod.string().min(1, { message: 'Parent name is required!' }),
  parent_cellphone: zod.string().min(1, { message: 'Parent cellphone is required!' }),
  // Not required
  status: zod.number(),
  approve_date: zod.date(),
  leave_date: zod.date().nullable().optional(),
  leave_message: zod.string(),  
  agree_marketing: zod.string(),
  // notification_type: zod.array(zod.string()),
  notification_type: zod.string(),
  registration_source: zod.string(),  
  last_login: zod.date().nullable().optional(),
  created_date: zod.date()
});

// ----------------------------------------------------------------------

type Props = {
  currentUser?: IUserItem;
};

export function UserNewEditForm({ currentUser }: Props) {
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      id: currentUser?.id || 0,
      type: currentUser?.type || 10,
      user_id: currentUser?.user_id || '',
      password: currentUser?.password || '',
      login_type: currentUser?.login_type || '',
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
      gender: currentUser?.gender || '',
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
      agree_marketing: currentUser?.agree_marketing || '',
      notification_type: currentUser?.notification_type || '',
      registration_source: currentUser?.registration_source || '',
      last_login: currentUser?.last_login ? new Date(currentUser.last_login) : undefined,
      created_date: currentUser?.created_date ? new Date(currentUser.created_date) : new Date(),
    }),
    [currentUser]
  );

  const methods = useForm<NewUserSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if(currentUser) {
      reset(defaultValues);
    } 
  }, [currentUser, defaultValues, reset]);

  const values = watch();

  const onSubmit = handleSubmit(async (data: NewUserSchemaType) => {
    try {
      if (currentUser) {
        const result = await MemberService.update({
          ...data,
          id: currentUser.id,
          leave_date: data.leave_date || undefined,
          last_login: data.last_login || undefined,
        });
        if(result === 'success') {
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
        if(result) {
          toast.success('회원이 등록되었습니다.');
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
    if(id) {
      MemberService.delete(id).then((value) => {
        toast.success('해당 유저 정보를 삭제하였습니다.');
        router.push(paths.member.list);
      });
    } 
  }, [router]);

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            {/* 
            {currentUser && (
              <Label
                color={
                  (values.status === 20 && 'success') ||
                  (values.status === 40 && 'error') ||
                  'warning'
                }
                sx={{ position: 'absolute', top: 24, right: 24 }}
              >
                {values.status}
              </Label>
            )}
            */}

            <Box sx={{ mb: 5 }}>
            <input type="hidden" name="image_file"/>
              <Field.UploadAvatar
                name="imageFileUrl"
                maxSize={3145728}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>

            {/*
            {currentUser && (
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value !== 20}
                        onChange={(event) =>
                          field.onChange(event.target.checked ? 'banned' : 'active')
                        }
                      />
                    )}
                  />
                }
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Banned
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Apply disable account
                    </Typography>
                  </>
                }
                sx={{
                  mx: 0,
                  mb: 3,
                  width: 1,
                  justifyContent: 'space-between',
                }}
              />
            )}

            <Field.Switch
              name="isVerified"
              labelPlacement="start"
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Email verified
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Disabling this will automatically send the user a verification email
                  </Typography>
                </>
              }
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            />
              
            */}

            {currentUser && (
              <Stack justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                <Button variant="soft" color="error" onClick={() => deleteMember(currentUser.id)}>
                  Delete user
                </Button>
              </Stack>
            )}
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            >
              <Field.Select
                name='type'
                size="medium"
                label="구분"
                InputLabelProps={{ shrink: true }}
              >
                <MenuItem
                  value={10}
                  sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                >
                  회원
                </MenuItem>
                <MenuItem
                  value={20}
                  sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                >
                  강사
                </MenuItem>
              </Field.Select>
            
              <Field.Text 
                  name="user_id" 
                  label="아이디" 
                />
                <Field.Text name="password" label="비밀번호" type="password"/>
                <Field.Select
                  name="login_type"
                  size="medium"
                  label="로그인 타입"
                  InputLabelProps={{ shrink: true }}
                >
                  <MenuItem
                    value='kakao'
                    sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                  >
                    카카오
                  </MenuItem>
                  <MenuItem
                    value='naver'
                    sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                  >
                    네이버
                  </MenuItem>
                </Field.Select>
                <Field.Text name="login_ci_data" label="로그인 CI 값" />
                <Field.Text name="name" label="이름"/>
                <Field.Text name="nickname" label="닉네임"/>
                <Field.Text name="cellphone" label="휴대폰번호"/>
                <Field.Text name="address1" label="주소"/>
                <Field.Text name="address2" label="상세주소"/>
                <Field.Text name="address3" label="상세주소"/>
                <Field.Text name="zip" label="우편번호"/>
                <Field.Text name="foreign_address" label="외국주소"/>
                <Field.Select
                  name='gender'
                  size="medium"
                  label="성별"
                  InputLabelProps={{ shrink: true }}
                >
                  <MenuItem
                    value='male'
                    sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                  >
                    남
                  </MenuItem>
                  <MenuItem
                    value='female'
                    sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                  >
                    여
                  </MenuItem>
                </Field.Select>
                <Field.Text name="school_name" label="학교명"/>
                <Field.Text name="grade" label="학년"/>
                <Field.Text name="memo" label="메모"/>  
                <Field.Text name="zoom_link_url" label="줌 링크"/>
                <Field.Text name="voov_link_url" label="Voov 링크"/>
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Voov 링크 노출 멤버
                  </Typography>
                  {(values?.voov_link_exposed_members || '').split(',').filter(Boolean).map((member: string, index: number) => (
                      <Stack key={index} direction="row" spacing={1} sx={{ mb: 1 }}>
                        <Field.Text
                          name={`voov_link_exposed_members_display_${index}`}
                          value={member.trim()}
                          size="small"
                          sx={{ flex: 1 }}
                          disabled
                        />
                        <IconButton 
                          onClick={() => {
                            const currentMembers = (values?.voov_link_exposed_members || '').split(',').filter(Boolean);
                            const newMembers = currentMembers.filter((_: any, i: number) => i !== index);
                            methods.setValue('voov_link_exposed_members', newMembers.join(','));
                          }}
                        >
                          <Iconify icon="eva:trash-2-outline" />
                        </IconButton>
                      </Stack>
                    ))
                  }
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <TextField
                      name="newMember"
                      label="새 멤버"
                      size="small"
                      sx={{ flex: 1 }}
                    />
                    <Button
                      variant="contained"
                      onClick={() => {
                        const newMember = (document.querySelector('input[name="newMember"]') as HTMLInputElement);
                        if (newMember) {
                          const currentMembers = (values?.voov_link_exposed_members || '').split(',').filter(Boolean);
                          const newMembers = [...currentMembers, newMember.value];
                          methods.setValue('voov_link_exposed_members', newMembers.join(','));
                          (document.querySelector('input[name="newMember"]') as HTMLInputElement).value = ''; // DOM을 직접 조작하여 input 값 초기화
                        }
                      }}
                    >
                      추가
                    </Button>
                  </Stack>
                </Box>
                <Field.Text name="parent_name" label="부모님 이름"/>
                <Field.Text name="parent_cellphone" label="부모님 휴대폰번호"/> 
                <Field.Select
                  name="status"
                  size="medium"
                  label="상태"
                  InputLabelProps={{ shrink: true }}
                  value={values.status} 
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    methods.setValue("status", value);
                    if (value === 20) {
                      methods.setValue("approve_date", new Date());
                    }
                  }}
                >
                  <MenuItem
                    value={20}
                    sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                  >
                    활동
                  </MenuItem>
                  <MenuItem
                    value={40}
                    sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                  >
                    탈퇴
                  </MenuItem>
                </Field.Select>
                <Field.Text 
                  name="approve_date" 
                  label="승인일" 
                  value={currentUser?.approve_date ? new Date(currentUser.approve_date).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : ''} 
                  disabled
                />
                <Field.Text 
                  name="leave_date" 
                  label="탈퇴일" 
                  value={currentUser?.leave_date ? new Date(currentUser.leave_date).toLocaleDateString('ko-KR', {
                    year: 'numeric', 
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : ''}
                  disabled
                />
                <Field.Text name="leave_message" label="탈퇴 메시지"/>
                <Field.Text name="agree_marketing" label="마케팅 동의" value={currentUser?.agree_marketing === 'true' ? '동의' : '동의 안함'} disabled/>
                <Controller
                  name="notification_type"
                  control={methods.control}
                  render={({ field }) => (
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        알림 타입
                      </Typography>
                      <Stack direction="row" spacing={2}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={field.value?.split(',').includes('email')}
                              onChange={(e) => {
                                const notificationValues = field.value ? field.value.split(',').filter(v => v) : [];
                                const newValue = e.target.checked
                                  ? [...notificationValues, 'email']
                                  : notificationValues.filter((v) => v !== 'email');
                                field.onChange(newValue.join(','));
                              }}
                            />
                          }
                          label="이메일"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={field.value?.split(',').includes('kakao')}
                              onChange={(e) => {
                                const notificationValues = field.value ? field.value.split(',').filter(v => v) : [];
                                const newValue = e.target.checked
                                  ? [...notificationValues, 'kakao']
                                  : notificationValues.filter((v) => v !== 'kakao');
                                field.onChange(newValue.join(','));
                              }}
                            />
                          }
                          label="카카오알림톡"
                        />
                      </Stack>
                    </Box>
                  )}
                />
                <Field.Text name="registration_source" label="가입 경로" />
                <Field.Text 
                  name="last_login" 
                  label="마지막 로그인" 
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

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentUser ? '생성' : '변경사항 저장'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
