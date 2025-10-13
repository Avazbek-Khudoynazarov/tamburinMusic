import { lazy, Suspense } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

import { MainLayout } from 'src/layouts/main';

import { SplashScreen } from 'src/components/loading-screen';
import useGlobalStore from 'src/stores/globalStore';

import { authRoutes } from './auth';
import { memberRoutes } from './member';
import { teacherRoutes } from './teacher';
import { instrumentRoutes } from './instrument';
import { curriculumRoutes } from './curriculum';
import { paymentsRoutes } from './payments';
import { calendarRoutes } from './calendar';
import { calculateRoutes } from './calculate';
import { chatRoutes } from './chat';
import { classesBoardRoutes } from './classesBoard';
import { settingsRoutes } from './settings';
import { bannerRoutes } from './banner';
import { popupRoutes } from './popup';
import { boardRoutes } from './board';


import { mainRoutes } from './main';
import { authDemoRoutes } from './auth-demo';
import { dashboardRoutes } from './dashboard';
import { componentsRoutes } from './components';

// ----------------------------------------------------------------------

const HomePage = lazy(() => import('src/pages/home'));

export function Router() {
  const { isAuthenticated } = useGlobalStore();

  return useRoutes([
    {
      path: '/',
      /**
       * Skip home page
       * element: <Navigate to={CONFIG.auth.redirectPath} replace />,
       */
      element: (
        <Suspense fallback={<SplashScreen />}>
          <MainLayout>
            {!isAuthenticated ? <Navigate to="/auth/sign-in" replace/> : <Navigate to='/member/list' replace/>}
          </MainLayout>
        </Suspense>
      ),
    },

    ...authRoutes,
    ...memberRoutes,
    ...teacherRoutes,
    ...instrumentRoutes,
    ...curriculumRoutes,
    ...paymentsRoutes,
    ...calendarRoutes,
    ...classesBoardRoutes,
    ...settingsRoutes,
    ...bannerRoutes,
    ...popupRoutes,
    ...boardRoutes,
    ...calculateRoutes,
    ...chatRoutes,




		// Main
    ...mainRoutes,



    // // Dashboard
    // ...dashboardRoutes,

    // // Components
    // ...componentsRoutes,

    // No match
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
