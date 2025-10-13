import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { DataGridView } from '@/components/UI/Minimal/sections/_examples/mui/data-grid-view';

// ----------------------------------------------------------------------

const metadata = { title: `DataGrid | MUI - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DataGridView />
    </>
  );
}
