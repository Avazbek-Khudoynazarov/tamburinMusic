import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { ScrollbarView } from '@/components/UI/Minimal/sections/_examples/extra/scrollbar-view';

// ----------------------------------------------------------------------

const metadata = { title: `Scrollbar | Components - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ScrollbarView />
    </>
  );
}
