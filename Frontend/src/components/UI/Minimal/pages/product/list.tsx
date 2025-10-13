import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';
import { useGetProducts } from '@/components/UI/Minimal/actions/product';

import { ProductShopView } from '@/components/UI/Minimal/sections/product/view';

// ----------------------------------------------------------------------

const metadata = { title: `Product shop - ${CONFIG.appName}` };

export default function Page() {
  const { products, productsLoading } = useGetProducts();

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ProductShopView products={products} loading={productsLoading} />
    </>
  );
}
