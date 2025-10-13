import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { AvatarView } from '@/components/UI/Minimal/sections/_examples/mui/avatar-view';

// ----------------------------------------------------------------------

const metadata = { title: `Avatar | MUI - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AvatarView />
    </>
  );
}
