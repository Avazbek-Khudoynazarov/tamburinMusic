import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { Auth0SignInView } from '@/components/UI/Minimal/auth/view/auth0';

// ----------------------------------------------------------------------

const metadata = { title: `Sign in | Auth0 - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <Auth0SignInView />
    </>
  );
}
