import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { AmplifyResetPasswordView } from '@/components/UI/Minimal/auth/view/amplify';
// ----------------------------------------------------------------------

const metadata = { title: `Reset password | Amplify - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AmplifyResetPasswordView />
    </>
  );
}
