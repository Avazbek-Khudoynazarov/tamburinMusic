import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthSplitLayout } from '@/components/UI/Minimal/layouts/auth-split';
import { AuthCenteredLayout } from '@/components/UI/Minimal/layouts/auth-centered';

import { SplashScreen } from '@/components/UI/Minimal/components/loading-screen';

// ----------------------------------------------------------------------

/** **************************************
 * Split layout
 *************************************** */
const SplitLayout = {
  SignInPage: lazy(() => import('@/components/UI/Minimal/pages/auth-demo/split/sign-in')),
  SignUpPage: lazy(() => import('@/components/UI/Minimal/pages/auth-demo/split/sign-up')),
  VerifyPage: lazy(() => import('@/components/UI/Minimal/pages/auth-demo/split/verify')),
  ResetPasswordPage: lazy(() => import('@/components/UI/Minimal/pages/auth-demo/split/reset-password')),
  UpdatePasswordPage: lazy(() => import('@/components/UI/Minimal/pages/auth-demo/split/update-password')),
};

const authSplit = {
  path: 'split',
  children: [
    {
      path: 'sign-in',
      element: (
        <AuthSplitLayout section={{ title: 'Hi, Welcome back' }}>
          <SplitLayout.SignInPage />
        </AuthSplitLayout>
      ),
    },
    {
      path: 'sign-up',
      element: (
        <AuthSplitLayout>
          <SplitLayout.SignUpPage />
        </AuthSplitLayout>
      ),
    },
    {
      path: 'verify',
      element: (
        <AuthSplitLayout>
          <SplitLayout.VerifyPage />
        </AuthSplitLayout>
      ),
    },
    {
      path: 'reset-password',
      element: (
        <AuthSplitLayout>
          <SplitLayout.ResetPasswordPage />
        </AuthSplitLayout>
      ),
    },
    {
      path: 'update-password',
      element: (
        <AuthSplitLayout>
          <SplitLayout.UpdatePasswordPage />
        </AuthSplitLayout>
      ),
    },
  ],
};

/** **************************************
 * Centered layout
 *************************************** */
const CenteredLayout = {
  SignInPage: lazy(() => import('@/components/UI/Minimal/pages/auth-demo/centered/sign-in')),
  SignUpPage: lazy(() => import('@/components/UI/Minimal/pages/auth-demo/centered/sign-up')),
  VerifyPage: lazy(() => import('@/components/UI/Minimal/pages/auth-demo/centered/verify')),
  ResetPasswordPage: lazy(() => import('@/components/UI/Minimal/pages/auth-demo/centered/reset-password')),
  UpdatePasswordPage: lazy(() => import('@/components/UI/Minimal/pages/auth-demo/centered/update-password')),
};

const authCentered = {
  path: 'centered',
  element: (
    <AuthCenteredLayout>
      <Outlet />
    </AuthCenteredLayout>
  ),
  children: [
    { path: 'sign-in', element: <CenteredLayout.SignInPage /> },
    { path: 'sign-up', element: <CenteredLayout.SignUpPage /> },
    { path: 'verify', element: <CenteredLayout.VerifyPage /> },
    { path: 'reset-password', element: <CenteredLayout.ResetPasswordPage /> },
    { path: 'update-password', element: <CenteredLayout.UpdatePasswordPage /> },
  ],
};

// ----------------------------------------------------------------------

export const authDemoRoutes = [
  {
    path: 'auth-demo',
    element: (
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    ),
    children: [authSplit, authCentered],
  },
];
