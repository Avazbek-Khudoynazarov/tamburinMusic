import { Helmet } from 'react-helmet-async';

import { useParams } from '@/components/UI/Minimal/routes/hooks';

import { _orders } from '@/components/UI/Minimal/_mock/_order';
import * as CONFIG from '@/config';

import { OrderDetailsView } from '@/components/UI/Minimal/sections/order/view';

// ----------------------------------------------------------------------

const metadata = { title: `Order details | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const currentOrder = _orders.find((order) => order.id === id);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <OrderDetailsView order={currentOrder} />
    </>
  );
}
