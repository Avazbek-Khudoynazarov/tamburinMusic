import type { IProductItem } from '@/components/UI/Minimal/types/product';

import { paths } from '@/components/UI/Minimal/routes/paths';

import { DashboardContent } from '@/components/UI/Minimal/layouts/dashboard';

import { CustomBreadcrumbs } from '@/components/UI/Minimal/components/custom-breadcrumbs';

import { ProductNewEditForm } from '../product-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  product?: IProductItem;
};

export function ProductEditView({ product }: Props) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Product', href: paths.dashboard.product.root },
          { name: product?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ProductNewEditForm currentProduct={product} />
    </DashboardContent>
  );
}
