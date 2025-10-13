import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { ProgressView } from '@/components/UI/Minimal/sections/_examples/mui/progress-view';

// ----------------------------------------------------------------------

const metadata = { title: `Progress | MUI - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ProgressView />
    </>
  );
}
