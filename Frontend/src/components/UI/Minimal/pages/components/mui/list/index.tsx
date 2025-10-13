import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { ListView } from '@/components/UI/Minimal/sections/_examples/mui/list-view';

// ----------------------------------------------------------------------

const metadata = { title: `List | MUI - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ListView />
    </>
  );
}
