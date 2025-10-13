import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { AnimateView } from '@/components/UI/Minimal/sections/_examples/extra/animate-view';

// ----------------------------------------------------------------------

const metadata = { title: `Animate | Components - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AnimateView />
    </>
  );
}
