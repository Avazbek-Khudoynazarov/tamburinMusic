import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { PermissionDeniedView } from '@/components/UI/Minimal/sections/permission/view';

// ----------------------------------------------------------------------

const metadata = { title: `Permission | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PermissionDeniedView />
    </>
  );
}
