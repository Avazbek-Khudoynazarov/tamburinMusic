import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { JobCreateView } from '@/components/UI/Minimal/sections/job/view';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new job | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <JobCreateView />
    </>
  );
}
