import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { JwtSignInView } from '@/components/UI/Minimal/auth/view/jwt';

// ----------------------------------------------------------------------

const metadata = { title: '탬버린뮤직 관리자 시스템' };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <JwtSignInView />
    </>
  );
}
