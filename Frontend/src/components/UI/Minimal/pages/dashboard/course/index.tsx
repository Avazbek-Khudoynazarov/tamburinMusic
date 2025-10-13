import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { OverviewCourseView } from '@/components/UI/Minimal/sections/overview/course/view';

// ----------------------------------------------------------------------

const metadata = { title: `Course | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <OverviewCourseView />
    </>
  );
}
