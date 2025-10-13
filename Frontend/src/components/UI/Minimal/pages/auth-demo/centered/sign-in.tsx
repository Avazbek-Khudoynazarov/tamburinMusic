import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { CenteredSignInView } from '@/components/UI/Minimal/auth/view/auth-demo/centered';

// ----------------------------------------------------------------------

const metadata = { title: `Sign in | Layout centered - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CenteredSignInView />
    </>
  );
}
