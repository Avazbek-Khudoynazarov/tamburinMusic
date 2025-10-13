import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { OrganizationalChartView } from '@/components/UI/Minimal/sections/_examples/extra/organizational-chart-view';

// ----------------------------------------------------------------------

const metadata = { title: `Organizational chart | Components - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <OrganizationalChartView />
    </>
  );
}
