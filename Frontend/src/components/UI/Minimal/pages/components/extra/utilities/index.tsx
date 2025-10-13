import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { UtilitiesView } from '@/components/UI/Minimal/sections/_examples/extra/utilities-view';

// ----------------------------------------------------------------------

const metadata = { title: `Utilities | Components - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <UtilitiesView />
    </>
  );
}
