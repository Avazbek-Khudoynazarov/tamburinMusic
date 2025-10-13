import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { CheckoutView } from '@/components/UI/Minimal/sections/checkout/view';

// ----------------------------------------------------------------------

const metadata = { title: `Checkout - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CheckoutView />
    </>
  );
}
