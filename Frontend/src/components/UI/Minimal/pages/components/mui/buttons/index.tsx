import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { ButtonView } from '@/components/UI/Minimal/sections/_examples/mui/button-view';

// ----------------------------------------------------------------------

const metadata = { title: `Button | MUI - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ButtonView />
    </>
  );
}
