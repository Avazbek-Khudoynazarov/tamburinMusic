import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { TourListView } from '@/components/UI/Minimal/sections/tour/view';

// ----------------------------------------------------------------------

const metadata = { title: `Tour list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TourListView />
    </>
  );
}
