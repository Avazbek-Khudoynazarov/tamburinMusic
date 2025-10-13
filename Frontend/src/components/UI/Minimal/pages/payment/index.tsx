import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { PaymentView } from '@/components/UI/Minimal/sections/payment/view';

// ----------------------------------------------------------------------

const metadata = { title: `Payment - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PaymentView />
    </>
  );
}
