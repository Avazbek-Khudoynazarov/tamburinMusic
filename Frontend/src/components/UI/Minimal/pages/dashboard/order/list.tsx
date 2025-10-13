import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { OrderListView } from '@/components/UI/Minimal/sections/order/view';

// ----------------------------------------------------------------------

const metadata = { title: `Order list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <OrderListView />
    </>
  );
}
