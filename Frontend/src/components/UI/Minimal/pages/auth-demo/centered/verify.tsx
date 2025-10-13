import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { CenteredVerifyView } from '@/components/UI/Minimal/auth/view/auth-demo/centered';

// ----------------------------------------------------------------------

const metadata = { title: `Verify | Layout centered - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CenteredVerifyView />
    </>
  );
}
