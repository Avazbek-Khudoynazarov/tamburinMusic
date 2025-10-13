import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { OverviewEcommerceView } from '@/components/UI/Minimal/sections/overview/e-commerce/view';

// ----------------------------------------------------------------------

const metadata = { title: `E-commerce | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <OverviewEcommerceView />
    </>
  );
}
