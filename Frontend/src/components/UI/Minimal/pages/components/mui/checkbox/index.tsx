import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { CheckboxView } from '@/components/UI/Minimal/sections/_examples/mui/checkbox-view';

// ----------------------------------------------------------------------

const metadata = { title: `Checkbox | MUI - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CheckboxView />
    </>
  );
}
