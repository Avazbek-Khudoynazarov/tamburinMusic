import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { PickerView } from '@/components/UI/Minimal/sections/_examples/mui/picker-view';

// ----------------------------------------------------------------------

const metadata = { title: `Date picker | MUI - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PickerView />
    </>
  );
}
