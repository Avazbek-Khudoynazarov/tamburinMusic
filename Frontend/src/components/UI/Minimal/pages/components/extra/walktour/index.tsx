import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { WalktourView } from '@/components/UI/Minimal/sections/_examples/extra/walktour-view';

// ----------------------------------------------------------------------

const metadata = { title: `Walktour | Components - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <WalktourView />
    </>
  );
}
