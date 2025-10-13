import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { SnackbarView } from '@/components/UI/Minimal/sections/_examples/extra/snackbar-view';

// ----------------------------------------------------------------------

const metadata = { title: `Snackbar | Components - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SnackbarView />
    </>
  );
}
