import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { TableView } from '@/components/UI/Minimal/sections/_examples/mui/table-view';

// ----------------------------------------------------------------------

const metadata = { title: `Table | MUI - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TableView />
    </>
  );
}
