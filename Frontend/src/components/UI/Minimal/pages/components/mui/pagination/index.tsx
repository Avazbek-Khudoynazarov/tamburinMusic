import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { PaginationView } from '@/components/UI/Minimal/sections/_examples/mui/pagination-view';

// ----------------------------------------------------------------------

const metadata = { title: `Pagination | MUI - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PaginationView />
    </>
  );
}
