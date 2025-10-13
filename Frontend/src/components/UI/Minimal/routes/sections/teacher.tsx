import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import * as CONFIG from '@/config';
import { DashboardLayout } from '@/components/UI/Minimal/layouts/dashboard';

import { LoadingScreen } from '@/components/UI/Minimal/components/loading-screen';

// ----------------------------------------------------------------------

// Teacher
const TeacherListPage = lazy(() => import('@/components/UI/Minimal/pages/custom/teacher/list'));
const TeacherEditPage = lazy(() => import('@/components/UI/Minimal/pages/custom/teacher/edit'));

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
