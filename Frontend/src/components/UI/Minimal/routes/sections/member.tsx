import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import * as CONFIG from '@/config';
import { DashboardLayout } from '@/components/UI/Minimal/layouts/dashboard';

import { LoadingScreen } from '@/components/UI/Minimal/components/loading-screen';

// ----------------------------------------------------------------------

// Member
const MemberListPage = lazy(() => import('@/components/UI/Minimal/pages/custom/member/list'));
const MemberEditPage = lazy(() => import('@/components/UI/Minimal/pages/custom/member/edit'));

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
