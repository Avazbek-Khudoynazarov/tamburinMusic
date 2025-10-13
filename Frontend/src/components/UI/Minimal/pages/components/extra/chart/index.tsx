import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { ChartView } from '@/components/UI/Minimal/sections/_examples/extra/chart-view';

// ----------------------------------------------------------------------

const metadata = { title: `Chart | Components - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ChartView />
    </>
  );
}
