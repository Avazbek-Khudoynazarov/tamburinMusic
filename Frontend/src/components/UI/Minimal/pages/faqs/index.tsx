import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { FaqsView } from '@/components/UI/Minimal/sections/faqs/view';

// ----------------------------------------------------------------------

const metadata = { title: `Faqs - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <FaqsView />
    </>
  );
}
