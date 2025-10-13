import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { TextfieldView } from '@/components/UI/Minimal/sections/_examples/mui/textfield-view';

// ----------------------------------------------------------------------

const metadata = { title: `Textfield | MUI - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TextfieldView />
    </>
  );
}
