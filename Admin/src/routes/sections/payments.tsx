import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// Payments
const PaymentsListPage = lazy(() => import('src/pages/custom/payments/list'));
const PaymentsEditPage = lazy(() => import('src/pages/custom/payments/edit'));

// ----------------------------------------------------------------------

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const paymentsRoutes = [
  {
     path: '/',
     element: <>{layoutContent}</>,
     children: [
       {
        path: 'payments',
        children: [
          { element: <PaymentsListPage />, index: true },
          { path: 'list', element: <PaymentsListPage /> },
          { path: 'new', element: <PaymentsEditPage /> },
          { path: ':id/:classes_id?/edit', element: <PaymentsEditPage /> },
        ],
       },
     ],
  },
];
