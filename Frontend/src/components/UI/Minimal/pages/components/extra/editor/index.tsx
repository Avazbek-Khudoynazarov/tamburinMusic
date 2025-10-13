import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { EditorView } from '@/components/UI/Minimal/sections/_examples/extra/editor-view';

// ----------------------------------------------------------------------

const metadata = { title: `Editor | Components - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <EditorView />
    </>
  );
}
