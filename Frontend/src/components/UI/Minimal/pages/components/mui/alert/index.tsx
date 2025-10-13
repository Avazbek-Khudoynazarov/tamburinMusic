import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { AlertView } from '@/components/UI/Minimal/sections/_examples/mui/alert-view';

// ----------------------------------------------------------------------

const metadata = { title: `Alert | MUI - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AlertView />
    </>
  );
}
