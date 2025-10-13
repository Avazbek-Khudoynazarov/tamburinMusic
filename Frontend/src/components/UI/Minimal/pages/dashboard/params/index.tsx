import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { BlankView } from '@/components/UI/Minimal/sections/blank/view';

// ----------------------------------------------------------------------

const metadata = { title: `Item params | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <BlankView title="Item active has params" />
    </>
  );
}
