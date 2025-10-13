import { Helmet } from 'react-helmet-async';

import { useParams } from '@/components/UI/Minimal/routes/hooks';

import * as CONFIG from '@/config';
import { _invoices } from '@/components/UI/Minimal/_mock/_invoice';

import { InvoiceDetailsView } from '@/components/UI/Minimal/sections/invoice/view';

// ----------------------------------------------------------------------

const metadata = { title: `Invoice details | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const currentInvoice = _invoices.find((invoice) => invoice.id === id);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <InvoiceDetailsView invoice={currentInvoice} />
    </>
  );
}
