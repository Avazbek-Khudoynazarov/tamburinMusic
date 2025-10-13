import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { AmplifySignUpView } from '@/components/UI/Minimal/auth/view/amplify';

// ----------------------------------------------------------------------

const metadata = { title: `Sign up | Amplify - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AmplifySignUpView />
    </>
  );
}
