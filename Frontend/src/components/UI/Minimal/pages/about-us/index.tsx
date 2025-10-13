import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { AboutView } from '@/components/UI/Minimal/sections/about/view';

// ----------------------------------------------------------------------

const metadata = { title: `About us - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AboutView />
    </>
  );
}
