import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { TooltipView } from '@/components/UI/Minimal/sections/_examples/mui/tooltip-view';

// ----------------------------------------------------------------------

const metadata = { title: `Tooltip | MUI - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TooltipView />
    </>
  );
}
