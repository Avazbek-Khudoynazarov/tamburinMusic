import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// Instrument
const InstrumentListPage = lazy(() => import('src/pages/custom/instrument/list'));
const InstrumentEditPage = lazy(() => import('src/pages/custom/instrument/edit'));

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
