import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// Member
const MemberListPage = lazy(() => import('src/pages/custom/member/list'));
const MemberEditPage = lazy(() => import('src/pages/custom/member/edit'));

// ----------------------------------------------------------------------

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const memberRoutes = [
  {
     path: '/',
     element: <>{layoutContent}</>,
     children: [
       {
        path: 'member',
        children: [
          { element: <MemberListPage />, index: true },
          { path: 'list', element: <MemberListPage /> },
          { path: 'new', element: <MemberEditPage /> },
          { path: ':id/edit', element: <MemberEditPage /> },
        ],
       },
     ],
  },
];
