import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { OverviewAnalyticsView } from '@/components/UI/Minimal/sections/overview/analytics/view';

// ----------------------------------------------------------------------

const metadata = { title: `Analytics | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <OverviewAnalyticsView />
    </>
  );
}
