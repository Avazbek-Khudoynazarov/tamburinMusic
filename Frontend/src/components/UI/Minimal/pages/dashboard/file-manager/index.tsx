import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { FileManagerView } from '@/components/UI/Minimal/sections/file-manager/view';

// ----------------------------------------------------------------------

const metadata = { title: `File manager | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <FileManagerView />
    </>
  );
}
