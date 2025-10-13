import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import * as CONFIG from '@/config';
import { DashboardLayout } from '@/components/UI/Minimal/layouts/dashboard';

import { LoadingScreen } from '@/components/UI/Minimal/components/loading-screen';

// ----------------------------------------------------------------------

// Board
const BoardListPage = lazy(() => import('@/components/UI/Minimal/pages/custom/board/list'));
const BoardEditPage = lazy(() => import('@/components/UI/Minimal/pages/custom/board/edit'));

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
          { path: ':type?/list', element: <BoardListPage /> },
          { path: ':type?/new', element: <BoardEditPage /> },
          { path: ':id/edit', element: <BoardEditPage /> },
        ],
       },
     ],
  },
];
