import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { TimelineView } from '@/components/UI/Minimal/sections/_examples/mui/timeline-view';

// ----------------------------------------------------------------------

const metadata = { title: `Timeline | MUI - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TimelineView />
    </>
  );
}
