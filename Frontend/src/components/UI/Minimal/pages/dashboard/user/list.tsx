import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { UserListView } from '@/components/UI/Minimal/sections/user/view';

// ----------------------------------------------------------------------

const metadata = { title: `User list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <UserListView />
    </>
  );
}
