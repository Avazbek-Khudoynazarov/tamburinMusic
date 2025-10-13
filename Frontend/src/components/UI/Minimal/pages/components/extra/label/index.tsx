import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { LabelView } from '@/components/UI/Minimal/sections/_examples/extra/label-view';

// ----------------------------------------------------------------------

const metadata = { title: `Label | Components - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <LabelView />
    </>
  );
}
