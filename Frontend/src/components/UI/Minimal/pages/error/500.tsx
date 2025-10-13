import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { View500 } from '@/components/UI/Minimal/sections/error';

// ----------------------------------------------------------------------

const metadata = { title: `500 Internal server error! | Error - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <View500 />
    </>
  );
}
