import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { AccountView } from '@/components/UI/Minimal/sections/account/view';

// ----------------------------------------------------------------------

const metadata = { title: `Account settings | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AccountView />
    </>
  );
}
