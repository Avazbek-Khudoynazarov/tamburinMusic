import type { IJobItem } from '@/components/UI/Minimal/types/job';

import { paths } from '@/components/UI/Minimal/routes/paths';

import { DashboardContent } from '@/components/UI/Minimal/layouts/dashboard';

import { CustomBreadcrumbs } from '@/components/UI/Minimal/components/custom-breadcrumbs';

import { JobNewEditForm } from '../job-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  job?: IJobItem;
};

export function JobEditView({ job }: Props) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Job', href: paths.dashboard.job.root },
          { name: job?.title },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <JobNewEditForm currentJob={job} />
    </DashboardContent>
  );
}
