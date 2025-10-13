import { Helmet } from 'react-helmet-async';

import { useParams } from '@/components/UI/Minimal/routes/hooks';

import * as CONFIG from '@/config';
import { useGetPost, useGetLatestPosts } from '@/components/UI/Minimal/actions/blog';

import { PostDetailsHomeView } from '@/components/UI/Minimal/sections/blog/view';

// ----------------------------------------------------------------------

const metadata = { title: `Post details - ${CONFIG.appName}` };

export default function Page() {
  const { title = '' } = useParams();

  const { post, postLoading, postError } = useGetPost(title);

  const { latestPosts } = useGetLatestPosts(title);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PostDetailsHomeView
        post={post}
        latestPosts={latestPosts}
        loading={postLoading}
        error={postError}
      />
    </>
  );
}
