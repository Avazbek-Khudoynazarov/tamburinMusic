import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { InvoiceListView } from '@/components/UI/Minimal/sections/invoice/view';

// ----------------------------------------------------------------------

const metadata = { title: `Invoice list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <InvoiceListView />
    </>
  );
}
