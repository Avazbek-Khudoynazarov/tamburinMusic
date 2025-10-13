import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { TypographyView } from '@/components/UI/Minimal/sections/_examples/foundation/typography-view';

// ----------------------------------------------------------------------

const metadata = { title: `Typography | Foundations - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TypographyView />
    </>
  );
}
