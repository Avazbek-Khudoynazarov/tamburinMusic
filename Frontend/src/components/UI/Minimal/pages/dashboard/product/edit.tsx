import { Helmet } from 'react-helmet-async';

import { useParams } from '@/components/UI/Minimal/routes/hooks';

import * as CONFIG from '@/config';
import { useGetProduct } from '@/components/UI/Minimal/actions/product';

import { ProductEditView } from '@/components/UI/Minimal/sections/product/view';

// ----------------------------------------------------------------------

const metadata = { title: `Product edit | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { product } = useGetProduct(id);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ProductEditView product={product} />
    </>
  );
}
