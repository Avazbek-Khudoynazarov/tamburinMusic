import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// Board
const BoardListPage = lazy(() => import('src/pages/custom/board/list'));
const BoardEditPage = lazy(() => import('src/pages/custom/board/edit'));

// ----------------------------------------------------------------------

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const boardRoutes = [
  {
     path: '/',
     element: <>{layoutContent}</>,
     children: [
       {
        path: 'board',
        children: [
          { element: <BoardListPage />, index: true },
          { path: ':type?', element: <BoardListPage /> },
          { path: ':type?/new', element: <BoardEditPage /> },
          { path: ':id/edit', element: <BoardEditPage /> },
        ],
       },
     ],
  },
];
