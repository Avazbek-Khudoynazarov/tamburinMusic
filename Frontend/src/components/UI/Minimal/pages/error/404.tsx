import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { NotFoundView } from '@/components/UI/Minimal/sections/error';

// ----------------------------------------------------------------------

const metadata = { title: `404 page not found! | Error - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <NotFoundView />
    </>
  );
}
