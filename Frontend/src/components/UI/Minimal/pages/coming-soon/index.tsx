import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { ComingSoonView } from '@/components/UI/Minimal/sections/coming-soon/view';

// ----------------------------------------------------------------------

const metadata = { title: `Coming soon - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ComingSoonView />
    </>
  );
}
