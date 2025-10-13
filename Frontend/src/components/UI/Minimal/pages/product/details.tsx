import { Helmet } from 'react-helmet-async';

import { useParams } from '@/components/UI/Minimal/routes/hooks';

import * as CONFIG from '@/config';
import { useGetProduct } from '@/components/UI/Minimal/actions/product';

import { ProductShopDetailsView } from '@/components/UI/Minimal/sections/product/view';

// ----------------------------------------------------------------------

const metadata = { title: `Product details - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { product, productLoading, productError } = useGetProduct(id);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ProductShopDetailsView product={product} loading={productLoading} error={productError} />
    </>
  );
}
