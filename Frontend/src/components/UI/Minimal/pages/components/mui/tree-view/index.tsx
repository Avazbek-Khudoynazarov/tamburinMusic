import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { TreeView } from '@/components/UI/Minimal/sections/_examples/mui/tree-view';

// ----------------------------------------------------------------------

const metadata = { title: `Tree view | MUI - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TreeView />
    </>
  );
}
