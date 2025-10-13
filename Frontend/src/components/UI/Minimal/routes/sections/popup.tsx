import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import * as CONFIG from '@/config';
import { DashboardLayout } from '@/components/UI/Minimal/layouts/dashboard';

import { LoadingScreen } from '@/components/UI/Minimal/components/loading-screen';

// ----------------------------------------------------------------------

// Popup
const PopupListPage = lazy(() => import('@/components/UI/Minimal/pages/custom/popup/list'));
const PopupEditPage = lazy(() => import('@/components/UI/Minimal/pages/custom/popup/edit'));

// ----------------------------------------------------------------------

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const popupRoutes = [
  {
     path: '/',
     element: <>{layoutContent}</>,
     children: [
       {
        path: 'popup',
        children: [
          { element: <PopupListPage />, index: true },
          { path: 'list', element: <PopupListPage /> },
          { path: 'new', element: <PopupEditPage /> },
          { path: ':id/edit', element: <PopupEditPage /> },
        ],
       },
     ],
  },
];
