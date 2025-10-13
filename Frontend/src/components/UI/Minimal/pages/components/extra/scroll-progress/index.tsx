import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { ScrollProgressView } from '@/components/UI/Minimal/sections/_examples/extra/scroll-progress-view';

// ----------------------------------------------------------------------

const metadata = { title: `Scroll progress | Components - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ScrollProgressView />
    </>
  );
}
