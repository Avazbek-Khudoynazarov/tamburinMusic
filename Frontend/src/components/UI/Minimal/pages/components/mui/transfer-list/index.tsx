import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { TransferListView } from '@/components/UI/Minimal/sections/_examples/mui/transfer-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Transfer list | MUI - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TransferListView />
    </>
  );
}
