import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { SplitResetPasswordView } from '@/components/UI/Minimal/auth/view/auth-demo/split';

// ----------------------------------------------------------------------

const metadata = { title: `Reset password | Layout split - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SplitResetPasswordView />
    </>
  );
}
