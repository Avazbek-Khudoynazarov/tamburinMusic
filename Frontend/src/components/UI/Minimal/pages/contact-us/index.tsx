import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { ContactView } from '@/components/UI/Minimal/sections/contact/view';

// ----------------------------------------------------------------------

const metadata = { title: `Contact us - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ContactView />
    </>
  );
}
