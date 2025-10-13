import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { RatingView } from '@/components/UI/Minimal/sections/_examples/mui/rating-view';

// ----------------------------------------------------------------------

const metadata = { title: `Rating | MUI - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <RatingView />
    </>
  );
}
