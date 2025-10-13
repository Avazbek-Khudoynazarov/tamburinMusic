import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { SwitchView } from '@/components/UI/Minimal/sections/_examples/mui/switch-view';

// ----------------------------------------------------------------------

const metadata = { title: `Switch | MUI - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SwitchView />
    </>
  );
}
