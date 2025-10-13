import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { OverviewBankingView } from '@/components/UI/Minimal/sections/overview/banking/view';

// ----------------------------------------------------------------------

const metadata = { title: `Banking | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <OverviewBankingView />
    </>
  );
}
