import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { MarkdownView } from '@/components/UI/Minimal/sections/_examples/extra/markdown-view';

// ----------------------------------------------------------------------

const metadata = { title: `Markdown | Components - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <MarkdownView />
    </>
  );
}
