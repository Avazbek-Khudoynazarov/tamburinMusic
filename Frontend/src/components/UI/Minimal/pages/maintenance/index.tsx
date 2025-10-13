import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { MaintenanceView } from '@/components/UI/Minimal/sections/maintenance/view';

// ----------------------------------------------------------------------

const metadata = { title: `Maintenance - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <MaintenanceView />
    </>
  );
}
