import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import * as CONFIG from '@/config';
import { DashboardLayout } from '@/components/UI/Minimal/layouts/dashboard';

import { LoadingScreen } from '@/components/UI/Minimal/components/loading-screen';

// ----------------------------------------------------------------------

// Instrument
const InstrumentListPage = lazy(() => import('@/components/UI/Minimal/pages/custom/instrument/list'));
const InstrumentEditPage = lazy(() => import('@/components/UI/Minimal/pages/custom/instrument/edit'));

// ----------------------------------------------------------------------

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const instrumentRoutes = [
  {
     path: '/',
     element: <>{layoutContent}</>,
     children: [
       {
        path: 'instrument',
        children: [
          { element: <InstrumentListPage />, index: true },
          { path: 'list', element: <InstrumentListPage /> },
          { path: 'new', element: <InstrumentEditPage /> },
          { path: ':id/edit', element: <InstrumentEditPage /> },
        ],
       },
     ],
  },
];
