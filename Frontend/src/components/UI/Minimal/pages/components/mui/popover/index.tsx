import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { PopoverView } from '@/components/UI/Minimal/sections/_examples/mui/popover-view';

// ----------------------------------------------------------------------

const metadata = { title: `Popover | MUI - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PopoverView />
    </>
  );
}
