import { Helmet } from 'react-helmet-async';

import { useParams } from '@/components/UI/Minimal/routes/hooks';

import * as CONFIG from '@/config';
import { useGetPost } from '@/components/UI/Minimal/actions/blog';

import { PostDetailsView } from '@/components/UI/Minimal/sections/blog/view';

// ----------------------------------------------------------------------

const metadata = { title: `Post details | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { title = '' } = useParams();

  const { post, postLoading, postError } = useGetPost(title);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PostDetailsView post={post} loading={postLoading} error={postError} />
    </>
  );
}
