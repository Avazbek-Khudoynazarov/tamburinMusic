import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import * as CONFIG from '@/config';
import { DashboardLayout } from '@/components/UI/Minimal/layouts/dashboard';

import { LoadingScreen } from '@/components/UI/Minimal/components/loading-screen';

// ----------------------------------------------------------------------

// ClassesBoard
const ClassesBoardListPage = lazy(() => import('@/components/UI/Minimal/pages/custom/classesBoard/list'));
const ClassesBoardEditPage = lazy(() => import('@/components/UI/Minimal/pages/custom/classesBoard/edit'));

// ----------------------------------------------------------------------

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const classesBoardRoutes = [
  {
     path: '/',
     element: <>{layoutContent}</>,
     children: [
       {
        path: 'classesBoard',
        children: [
          { element: <ClassesBoardListPage />, index: true },
          { path: 'list', element: <ClassesBoardListPage /> },
          { path: 'new', element: <ClassesBoardEditPage /> },
          { path: ':id/:classes_id?/edit', element: <ClassesBoardEditPage /> },
        ],
       },
     ],
  },
];
