import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// Popup
const PopupListPage = lazy(() => import('src/pages/custom/popup/list'));
const PopupEditPage = lazy(() => import('src/pages/custom/popup/edit'));

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
