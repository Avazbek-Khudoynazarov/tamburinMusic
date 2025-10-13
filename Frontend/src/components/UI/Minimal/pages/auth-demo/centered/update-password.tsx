import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { CenteredUpdatePasswordView } from '@/components/UI/Minimal/auth/view/auth-demo/centered';

// ----------------------------------------------------------------------

const metadata = { title: `Update password | Layout centered - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CenteredUpdatePasswordView />
    </>
  );
}
