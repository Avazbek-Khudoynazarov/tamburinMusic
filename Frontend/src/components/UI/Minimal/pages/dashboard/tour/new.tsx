import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { TourCreateView } from '@/components/UI/Minimal/sections/tour/view';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new tour | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TourCreateView />
    </>
  );
}
