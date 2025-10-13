import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { UserCreateView } from '@/components/UI/Minimal/sections/user/view';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new user | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <UserCreateView />
    </>
  );
}
