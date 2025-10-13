import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { IconsView } from '@/components/UI/Minimal/sections/_examples/foundation/icons-view';

// ----------------------------------------------------------------------

const metadata = { title: `Icons | Foundations - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <IconsView />
    </>
  );
}
