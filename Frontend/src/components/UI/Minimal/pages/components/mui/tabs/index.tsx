import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { TabsView } from '@/components/UI/Minimal/sections/_examples/mui/tabs-view';

// ----------------------------------------------------------------------

const metadata = { title: `Tabs | MUI - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TabsView />
    </>
  );
}
