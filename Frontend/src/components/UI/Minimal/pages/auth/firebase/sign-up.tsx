import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { FirebaseSignUpView } from '@/components/UI/Minimal/auth/view/firebase';

// ----------------------------------------------------------------------

const metadata = { title: `Sign up | Firebase - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <FirebaseSignUpView />
    </>
  );
}
