import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// Curriculum
const CurriculumListPage = lazy(() => import('src/pages/custom/curriculum/list'));
const CurriculumEditPage = lazy(() => import('src/pages/custom/curriculum/edit'));

// ----------------------------------------------------------------------

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const curriculumRoutes = [
  {
     path: '/',
     element: <>{layoutContent}</>,
     children: [
       {
        path: 'curriculum',
        children: [
          { element: <CurriculumListPage />, index: true },
          { path: 'list', element: <CurriculumListPage /> },
          { path: 'new', element: <CurriculumEditPage /> },
          { path: ':id/edit', element: <CurriculumEditPage /> },
        ],
       },
     ],
  },
];
