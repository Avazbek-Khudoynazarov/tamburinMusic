import { Helmet } from 'react-helmet-async';

import { useParams } from '@/components/UI/Minimal/routes/hooks';

import { _jobs } from '@/components/UI/Minimal/_mock/_job';
import * as CONFIG from '@/config';

import { JobEditView } from '@/components/UI/Minimal/sections/job/view';

// ----------------------------------------------------------------------

const metadata = { title: `Job edit | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const currentJob = _jobs.find((job) => job.id === id);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <JobEditView job={currentJob} />
    </>
  );
}
