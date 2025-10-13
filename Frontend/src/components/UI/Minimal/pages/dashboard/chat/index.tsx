import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { ChatView } from '@/components/UI/Minimal/sections/chat/view';

// ----------------------------------------------------------------------

const metadata = { title: `Chat | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ChatView />
    </>
  );
}
