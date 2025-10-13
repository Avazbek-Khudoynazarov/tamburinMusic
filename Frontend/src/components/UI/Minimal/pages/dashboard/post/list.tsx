import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { PostListView } from '@/components/UI/Minimal/sections/blog/view';

// ----------------------------------------------------------------------

const metadata = { title: `Post list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PostListView />
    </>
  );
}
