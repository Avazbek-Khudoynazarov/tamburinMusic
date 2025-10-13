import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import * as CONFIG from '@/config';
import { DashboardLayout } from '@/components/UI/Minimal/layouts/dashboard';

import { LoadingScreen } from '@/components/UI/Minimal/components/loading-screen';

// ----------------------------------------------------------------------

// Banner
const BannerEditPage = lazy(() => import('@/components/UI/Minimal/pages/custom/banner/edit'));

// ----------------------------------------------------------------------

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const bannerRoutes = [
  {
     path: '/',
     element: <>{layoutContent}</>,
     children: [
       {
        path: 'banner',
        children: [
          { element: <BannerEditPage />, index: true },
        ],
       },
     ],
  },
];
