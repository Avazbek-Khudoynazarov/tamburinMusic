import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { ShadowsView } from '@/components/UI/Minimal/sections/_examples/foundation/shadows-view';

// ----------------------------------------------------------------------

const metadata = { title: `Shadows | Foundations - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ShadowsView />
    </>
  );
}
