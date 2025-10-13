import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import * as CONFIG from '@/config';
import { DashboardLayout } from '@/components/UI/Minimal/layouts/dashboard';

import { LoadingScreen } from '@/components/UI/Minimal/components/loading-screen';

// ----------------------------------------------------------------------

// Payments
const PaymentsListPage = lazy(() => import('@/components/UI/Minimal/pages/custom/payments/list'));
const PaymentsEditPage = lazy(() => import('@/components/UI/Minimal/pages/custom/payments/edit'));

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
