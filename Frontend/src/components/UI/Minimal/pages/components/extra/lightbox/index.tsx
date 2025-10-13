import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { LightboxView } from '@/components/UI/Minimal/sections/_examples/extra/lightbox-view';

// ----------------------------------------------------------------------

const metadata = { title: `Lightbox | Components - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <LightboxView />
    </>
  );
}
