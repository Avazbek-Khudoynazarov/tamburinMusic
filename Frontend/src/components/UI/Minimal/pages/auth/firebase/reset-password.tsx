import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { FirebaseResetPasswordView } from '@/components/UI/Minimal/auth/view/firebase';

// ----------------------------------------------------------------------

const metadata = { title: `Reset password | Firebase - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <FirebaseResetPasswordView />
    </>
  );
}
