import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { CalendarView } from '@/components/UI/Minimal/sections/calendar/view';

// ----------------------------------------------------------------------

const metadata = { title: `Calendar | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CalendarView />
    </>
  );
}
