import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { ProductCreateView } from '@/components/UI/Minimal/sections/product/view';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new product | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ProductCreateView />
    </>
  );
}
