import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { JobListView } from '@/components/UI/Minimal/sections/job/view';

// ----------------------------------------------------------------------

const metadata = { title: `Job list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <JobListView />
    </>
  );
}
