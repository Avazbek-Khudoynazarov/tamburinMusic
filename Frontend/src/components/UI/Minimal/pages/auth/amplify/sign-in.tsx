import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { AmplifySignInView } from '@/components/UI/Minimal/auth/view/amplify';

// ----------------------------------------------------------------------

const metadata = { title: `Sign in | Amplify - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AmplifySignInView />
    </>
  );
}
