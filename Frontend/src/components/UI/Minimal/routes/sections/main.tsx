import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { MainLayout } from '@/components/UI/Minimal/layouts/main';
import { SimpleLayout } from '@/components/UI/Minimal/layouts/simple';

import { SplashScreen } from '@/components/UI/Minimal/components/loading-screen';

// ----------------------------------------------------------------------

const FaqsPage = lazy(() => import('@/components/UI/Minimal/pages/faqs'));
const AboutPage = lazy(() => import('@/components/UI/Minimal/pages/about-us'));
const ContactPage = lazy(() => import('@/components/UI/Minimal/pages/contact-us'));
const PricingPage = lazy(() => import('@/components/UI/Minimal/pages/pricing'));
const PaymentPage = lazy(() => import('@/components/UI/Minimal/pages/payment'));
const ComingSoonPage = lazy(() => import('@/components/UI/Minimal/pages/coming-soon'));
const MaintenancePage = lazy(() => import('@/components/UI/Minimal/pages/maintenance'));
// Product
const ProductListPage = lazy(() => import('@/components/UI/Minimal/pages/product/list'));
const ProductDetailsPage = lazy(() => import('@/components/UI/Minimal/pages/product/details'));
const ProductCheckoutPage = lazy(() => import('@/components/UI/Minimal/pages/product/checkout'));
// Blog
const PostListPage = lazy(() => import('@/components/UI/Minimal/pages/post/list'));
const PostDetailsPage = lazy(() => import('@/components/UI/Minimal/pages/post/details'));
// Error
const Page500 = lazy(() => import('@/components/UI/Minimal/pages/error/500'));
const Page403 = lazy(() => import('@/components/UI/Minimal/pages/error/403'));
const Page404 = lazy(() => import('@/components/UI/Minimal/pages/error/404'));
// Blank
const BlankPage = lazy(() => import('@/components/UI/Minimal/pages/blank'));

// ----------------------------------------------------------------------

export const mainRoutes = [
  {
    element: (
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    ),
    children: [
      {
        element: (
          <MainLayout>
            <Outlet />
          </MainLayout>
        ),
        children: [
          {
            path: 'about-us',
            element: <AboutPage />,
          },
          {
            path: 'contact-us',
            element: <ContactPage />,
          },
          {
            path: 'faqs',
            element: <FaqsPage />,
          },
          {
            path: 'blank',
            element: <BlankPage />,
          },
          {
            path: 'product',
            children: [
              { element: <ProductListPage />, index: true },
              { path: 'list', element: <ProductListPage /> },
              { path: ':id', element: <ProductDetailsPage /> },
              { path: 'checkout', element: <ProductCheckoutPage /> },
            ],
          },
          {
            path: 'post',
            children: [
              { element: <PostListPage />, index: true },
              { path: 'list', element: <PostListPage /> },
              { path: ':title', element: <PostDetailsPage /> },
            ],
          },
        ],
      },
      {
        path: 'pricing',
        element: (
          <SimpleLayout>
            <PricingPage />
          </SimpleLayout>
        ),
      },
      {
        path: 'payment',
        element: (
          <SimpleLayout>
            <PaymentPage />
          </SimpleLayout>
        ),
      },
      {
        path: 'coming-soon',
        element: (
          <SimpleLayout content={{ compact: true }}>
            <ComingSoonPage />
          </SimpleLayout>
        ),
      },
      {
        path: 'maintenance',
        element: (
          <SimpleLayout content={{ compact: true }}>
            <MaintenancePage />
          </SimpleLayout>
        ),
      },
      { path: '500', element: <Page500 /> },
      { path: '404', element: <Page404 /> },
      { path: '403', element: <Page403 /> },
    ],
  },
];
