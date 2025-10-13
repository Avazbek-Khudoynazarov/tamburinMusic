import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { KanbanView } from '@/components/UI/Minimal/sections/kanban/view';

// ----------------------------------------------------------------------

const metadata = { title: `Kanban | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <KanbanView />
    </>
  );
}
