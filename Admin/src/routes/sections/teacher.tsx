import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// Teacher
const TeacherListPage = lazy(() => import('src/pages/custom/teacher/list'));
const TeacherEditPage = lazy(() => import('src/pages/custom/teacher/edit'));

// ----------------------------------------------------------------------

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const teacherRoutes = [
  {
     path: '/',
     element: <>{layoutContent}</>,
     children: [
       {
        path: 'teacher',
        children: [
          { element: <TeacherListPage />, index: true },
          { path: 'list', element: <TeacherListPage /> },
          { path: 'new', element: <TeacherEditPage /> },
          { path: ':id/edit', element: <TeacherEditPage /> },
        ],
       },
     ],
  },
];
