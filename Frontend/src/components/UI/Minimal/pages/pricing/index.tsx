import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { PricingView } from '@/components/UI/Minimal/sections/pricing/view';

// ----------------------------------------------------------------------

const metadata = { title: `Pricing - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PricingView />
    </>
  );
}
