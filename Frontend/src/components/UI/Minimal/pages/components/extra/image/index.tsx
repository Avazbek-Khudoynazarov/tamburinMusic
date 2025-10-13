import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { ImageView } from '@/components/UI/Minimal/sections/_examples/extra/image-view';

// ----------------------------------------------------------------------

const metadata = { title: `Image | Components - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ImageView />
    </>
  );
}
