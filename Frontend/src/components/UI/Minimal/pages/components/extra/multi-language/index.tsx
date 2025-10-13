import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { MultiLanguageView } from '@/components/UI/Minimal/sections/_examples/extra/multi-language-view';

// ----------------------------------------------------------------------

const metadata = { title: `Multi language | Components - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <MultiLanguageView />
    </>
  );
}
