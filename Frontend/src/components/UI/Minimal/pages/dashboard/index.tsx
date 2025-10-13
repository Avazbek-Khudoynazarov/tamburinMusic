import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { OverviewAppView } from '@/components/UI/Minimal/sections/overview/app/view';

// ----------------------------------------------------------------------

const metadata = { title: `Dashboard - ${CONFIG.appName}` };

export default function OverviewAppPage() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <OverviewAppView />
    </>
  );
}
