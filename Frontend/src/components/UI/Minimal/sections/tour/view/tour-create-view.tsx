import { paths } from '@/components/UI/Minimal/routes/paths';

import { DashboardContent } from '@/components/UI/Minimal/layouts/dashboard';

import { CustomBreadcrumbs } from '@/components/UI/Minimal/components/custom-breadcrumbs';

import { TourNewEditForm } from '../tour-new-edit-form';

// ----------------------------------------------------------------------

export function TourCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new tour"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Tour', href: paths.dashboard.tour.root },
          { name: 'New tour' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <TourNewEditForm />
    </DashboardContent>
  );
}
