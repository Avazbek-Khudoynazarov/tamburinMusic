import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { BadgeView } from '@/components/UI/Minimal/sections/_examples/mui/badge-view';

// ----------------------------------------------------------------------

const metadata = { title: `Badge | MUI - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <BadgeView />
    </>
  );
}
