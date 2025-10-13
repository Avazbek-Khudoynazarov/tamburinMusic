import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { UploadView } from '@/components/UI/Minimal/sections/_examples/extra/upload-view';

// ----------------------------------------------------------------------

const metadata = { title: `Upload | Components - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <UploadView />
    </>
  );
}
