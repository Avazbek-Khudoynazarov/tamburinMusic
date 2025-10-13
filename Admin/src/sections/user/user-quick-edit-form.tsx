import type { IUserItem } from 'src/types/user';

import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { USER_STATUS_OPTIONS } from 'src/_mock';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type UserQuickEditSchemaType = zod.infer<typeof UserQuickEditSchema>;

export const UserQuickEditSchema = zod.object({
  // imageFileUrl: schemaHelper.file({ message: { required_error: 'Avatar is required!' } }),
  name: zod.string().min(1, { message: 'Name is required!' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  phoneNumber: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  country: schemaHelper.objectOrNull<string | null>({
    message: { required_error: 'Country is required!' },
  }),
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
  company: zod.string().min(1, { message: 'Company is required!' }),
  state: zod.string().min(1, { message: 'State is required!' }),
  city: zod.string().min(1, { message: 'City is required!' }),
  role: zod.string().min(1, { message: 'Role is required!' }),
  zipCode: zod.string().min(1, { message: 'Zip code is required!' }),
  // Not required
  status: zod.number(),
  isVerified: zod.boolean(),
  agree_marketing: zod.string(),
  // notification_type: zod.array(zod.string()),
  notification_type: zod.string(),
  registration_source: zod.string(),  
  leave_message: zod.string(),  
  image_file: zod.string(),
  approve_date: zod.date(),
  leave_date: zod.date(),
  last_login: zod.date(),
  created_date: zod.date(), 
});

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  currentUser?: IUserItem;
};

export function UserQuickEditForm({ currentUser, open, onClose }: Props) {
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
      status: currentUser?.status || 10,
      approve_date: currentUser?.approve_date ? new Date(currentUser.approve_date) : undefined,
      leave_date: currentUser?.leave_date ? new Date(currentUser.leave_date) : undefined,
      leave_message: currentUser?.leave_message || '',  
      agree_marketing: currentUser?.agree_marketing || '',
      notification_type: currentUser?.notification_type || '',
      registration_source: currentUser?.registration_source || '',
      last_login: currentUser?.last_login,
      created_date: currentUser?.created_date,
    }),
    [currentUser]
  );

  const methods = useForm<UserQuickEditSchemaType>({
    mode: 'all',
    resolver: zodResolver(UserQuickEditSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const promise = new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      reset();
      onClose();

      toast.promise(promise, {
        loading: 'Loading...',
        success: 'Update success!',
        error: 'Update error!',
      });

      await promise;

      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { maxWidth: 720 } }}
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Quick Update</DialogTitle>

        <DialogContent>
          <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            Account is waiting for confirmation
          </Alert>

          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
          >
            <Field.Select name="status" label="Status">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>

            <Box sx={{ display: { xs: 'none', sm: 'block' } }} />

            <Field.Text name="name" label="Full name" />
            <Field.Text name="email" label="Email address" />
            <Field.Phone name="phoneNumber" label="Phone number" />

            <Field.CountrySelect
              fullWidth
              name="country"
              label="Country"
              placeholder="Choose a country"
            />

            <Field.Text name="state" label="State/region" />
            <Field.Text name="city" label="City" />
            <Field.Text name="address" label="Address" />
            <Field.Text name="zipCode" label="Zip/code" />
            <Field.Text name="company" label="Company" />
            <Field.Text name="role" label="Role" />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Update
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
