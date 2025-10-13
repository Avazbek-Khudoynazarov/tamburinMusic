import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { OverviewFileView } from '@/components/UI/Minimal/sections/overview/file/view';

// ----------------------------------------------------------------------

const metadata = { title: `File | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <OverviewFileView />
    </>
  );
}
