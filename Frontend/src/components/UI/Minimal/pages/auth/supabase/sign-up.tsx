import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { SupabaseSignUpView } from '@/components/UI/Minimal/auth/view/supabase';

// ----------------------------------------------------------------------

const metadata = { title: `Sign up | Supabase - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SupabaseSignUpView />
    </>
  );
}
