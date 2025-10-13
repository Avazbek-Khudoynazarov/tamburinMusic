import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { FirebaseSignInView } from '@/components/UI/Minimal/auth/view/firebase';

// ----------------------------------------------------------------------

const metadata = { title: `Sign in | Firebase - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <FirebaseSignInView />
    </>
  );
}
