import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { ChipView } from '@/components/UI/Minimal/sections/_examples/mui/chip-view';

// ----------------------------------------------------------------------

const metadata = { title: `Chip | MUI - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ChipView />
    </>
  );
}
