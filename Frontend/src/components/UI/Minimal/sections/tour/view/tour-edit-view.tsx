import type { ITourItem } from '@/components/UI/Minimal/types/tour';

import { paths } from '@/components/UI/Minimal/routes/paths';

import { DashboardContent } from '@/components/UI/Minimal/layouts/dashboard';

import { CustomBreadcrumbs } from '@/components/UI/Minimal/components/custom-breadcrumbs';

import { TourNewEditForm } from '../tour-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  tour?: ITourItem;
};

export function TourEditView({ tour }: Props) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Tour', href: paths.dashboard.tour.root },
          { name: tour?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <TourNewEditForm currentTour={tour} />
    </DashboardContent>
  );
}
