import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { OverviewBookingView } from '@/components/UI/Minimal/sections/overview/booking/view';

// ----------------------------------------------------------------------

const metadata = { title: `Booking | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <OverviewBookingView />
    </>
  );
}
