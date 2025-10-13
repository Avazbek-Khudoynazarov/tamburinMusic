import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import * as CONFIG from '@/config';
import { DashboardLayout } from '@/components/UI/Minimal/layouts/dashboard';

import { LoadingScreen } from '@/components/UI/Minimal/components/loading-screen';

// ----------------------------------------------------------------------

// Curriculum
const CurriculumListPage = lazy(() => import('@/components/UI/Minimal/pages/custom/curriculum/list'));
const CurriculumEditPage = lazy(() => import('@/components/UI/Minimal/pages/custom/curriculum/edit'));

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
