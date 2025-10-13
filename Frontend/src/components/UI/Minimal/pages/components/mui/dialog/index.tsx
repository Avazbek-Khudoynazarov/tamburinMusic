import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { DialogView } from '@/components/UI/Minimal/sections/_examples/mui/dialog-view';

// ----------------------------------------------------------------------

const metadata = { title: `Dialog | MUI - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DialogView />
    </>
  );
}
