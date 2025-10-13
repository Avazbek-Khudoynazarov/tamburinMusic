import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { MapView } from '@/components/UI/Minimal/sections/_examples/extra/map-view';

// ----------------------------------------------------------------------

const metadata = { title: `Map | Components - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <MapView />
    </>
  );
}
