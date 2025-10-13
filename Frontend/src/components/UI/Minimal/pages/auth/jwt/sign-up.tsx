import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { JwtSignUpView } from '@/components/UI/Minimal/auth/view/jwt';

// ----------------------------------------------------------------------

const metadata = { title: `Sign up | Jwt - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <JwtSignUpView />
    </>
  );
}
