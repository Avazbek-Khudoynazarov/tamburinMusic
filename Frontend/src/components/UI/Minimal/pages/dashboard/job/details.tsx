import { Helmet } from 'react-helmet-async';

import { useParams } from '@/components/UI/Minimal/routes/hooks';

import { _jobs } from '@/components/UI/Minimal/_mock/_job';
import * as CONFIG from '@/config';

import { JobDetailsView } from '@/components/UI/Minimal/sections/job/view';

// ----------------------------------------------------------------------

const metadata = { title: `Job details | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const currentJob = _jobs.find((job) => job.id === id);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <JobDetailsView job={currentJob} />
    </>
  );
}
