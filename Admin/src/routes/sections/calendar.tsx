import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// Calendar
const CalendarView = lazy(() => import('src/pages/custom/calendar/list'));

// ----------------------------------------------------------------------

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const calendarRoutes = [
  {
     path: '/',
     element: <>{layoutContent}</>,
     children: [
       {
        path: 'calendar',
        children: [
          { element: <CalendarView />, index: true },
        ],
       },
     ],
  },
];
