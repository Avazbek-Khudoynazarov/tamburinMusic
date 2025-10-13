import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { BreadcrumbsView } from '@/components/UI/Minimal/sections/_examples/mui/breadcrumbs-view';

// ----------------------------------------------------------------------

const metadata = { title: `Breadcrumbs | MUI - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <BreadcrumbsView />
    </>
  );
}
