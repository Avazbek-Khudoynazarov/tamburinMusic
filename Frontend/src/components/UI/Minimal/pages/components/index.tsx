import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { ComponentsView } from '@/components/UI/Minimal/sections/_examples/view';

// ----------------------------------------------------------------------

const metadata = { title: `All components | MUI - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ComponentsView />
    </>
  );
}
