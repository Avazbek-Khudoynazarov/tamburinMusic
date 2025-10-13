import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { SupabaseVerifyView } from '@/components/UI/Minimal/auth/view/supabase';

// ----------------------------------------------------------------------

const metadata = { title: `Verify | Supabase - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SupabaseVerifyView />
    </>
  );
}
