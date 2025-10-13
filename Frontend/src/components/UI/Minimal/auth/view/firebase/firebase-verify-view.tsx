import { paths } from '@/components/UI/Minimal/routes/paths';

import { EmailInboxIcon } from '@/components/UI/Minimal/assets/icons';

import { FormHead } from '../../components/form-head';
import { FormReturnLink } from '../../components/form-return-link';

// ----------------------------------------------------------------------

export function FirebaseVerifyView() {
  return (
    <>
      <FormHead
        icon={<EmailInboxIcon />}
        title="Please check your email!"
        description={`We've emailed a 6-digit confirmation code. \nPlease enter the code in the box below to verify your email.`}
      />

      <FormReturnLink href={paths.auth.firebase.signIn} sx={{ mt: 0 }} />
    </>
  );
}
