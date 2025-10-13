import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { InvoiceCreateView } from '@/components/UI/Minimal/sections/invoice/view';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new invoice | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <InvoiceCreateView />
    </>
  );
}
