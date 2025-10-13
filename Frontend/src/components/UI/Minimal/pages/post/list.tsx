import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';
import { useGetPosts } from '@/components/UI/Minimal/actions/blog';

import { PostListHomeView } from '@/components/UI/Minimal/sections/blog/view';

// ----------------------------------------------------------------------

const metadata = { title: `Post list - ${CONFIG.appName}` };

export default function Page() {
  const { posts, postsLoading } = useGetPosts();

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PostListHomeView posts={posts} loading={postsLoading} />
    </>
  );
}
