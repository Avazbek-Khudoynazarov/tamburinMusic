import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { MegaMenuView } from '@/components/UI/Minimal/sections/_examples/extra/mega-menu-view';

// ----------------------------------------------------------------------

const metadata = { title: `Mega menu | Components - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <MegaMenuView />
    </>
  );
}
