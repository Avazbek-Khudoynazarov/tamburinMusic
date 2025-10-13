import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { UserProfileView } from '@/components/UI/Minimal/sections/user/view';

// ----------------------------------------------------------------------

const metadata = { title: `User profile | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <UserProfileView />
    </>
  );
}
