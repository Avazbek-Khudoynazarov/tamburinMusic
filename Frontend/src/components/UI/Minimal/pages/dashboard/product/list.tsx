import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { ProductListView } from '@/components/UI/Minimal/sections/product/view';

// ----------------------------------------------------------------------

const metadata = { title: `Product list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ProductListView />
    </>
  );
}
