import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { NavigationBarView } from '@/components/UI/Minimal/sections/_examples/extra/navigation-bar-view';

// ----------------------------------------------------------------------

const metadata = { title: `Navigation bar | Components - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <NavigationBarView />
    </>
  );
}
