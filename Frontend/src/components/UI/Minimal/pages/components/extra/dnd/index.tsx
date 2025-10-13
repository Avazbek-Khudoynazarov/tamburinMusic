import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { DndView } from '@/components/UI/Minimal/sections/_examples/extra/dnd-view';

// ----------------------------------------------------------------------

const metadata = { title: `Dnd | Components - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DndView />
    </>
  );
}
