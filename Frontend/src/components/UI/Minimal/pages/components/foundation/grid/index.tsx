import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { GridView } from '@/components/UI/Minimal/sections/_examples/foundation/grid-view';

// ----------------------------------------------------------------------

const metadata = { title: `Grid | Foundations - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <GridView />
    </>
  );
}
