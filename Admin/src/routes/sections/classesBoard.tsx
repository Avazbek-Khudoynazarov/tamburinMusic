import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// ClassesBoard
const ClassesBoardListPage = lazy(() => import('src/pages/custom/classesBoard/list'));
const ClassesBoardEditPage = lazy(() => import('src/pages/custom/classesBoard/edit'));

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
