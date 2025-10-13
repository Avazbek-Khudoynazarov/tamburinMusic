import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { MenuView } from '@/components/UI/Minimal/sections/_examples/mui/menu-view';

// ----------------------------------------------------------------------

const metadata = { title: `Menu | MUI - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <MenuView />
    </>
  );
}
