import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { MailView } from '@/components/UI/Minimal/sections/mail/view';

// ----------------------------------------------------------------------

const metadata = { title: `Mail | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <MailView />
    </>
  );
}
