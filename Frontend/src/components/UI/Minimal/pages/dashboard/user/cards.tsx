import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { UserCardsView } from '@/components/UI/Minimal/sections/user/view';

// ----------------------------------------------------------------------

const metadata = { title: `User cards | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <UserCardsView />
    </>
  );
}
