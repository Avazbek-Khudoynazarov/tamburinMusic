import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { RadioButtonView } from '@/components/UI/Minimal/sections/_examples/mui/radio-button-view';

// ----------------------------------------------------------------------

const metadata = { title: `Radio button | MUI - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <RadioButtonView />
    </>
  );
}
