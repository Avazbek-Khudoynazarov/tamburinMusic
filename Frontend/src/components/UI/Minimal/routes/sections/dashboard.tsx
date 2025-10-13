import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import * as CONFIG from '@/config';
import { DashboardLayout } from '@/components/UI/Minimal/layouts/dashboard';

import { LoadingScreen } from '@/components/UI/Minimal/components/loading-screen';

import { AuthGuard } from '@/components/UI/Minimal/auth/guard';

// ----------------------------------------------------------------------

// Overview
const IndexPage = lazy(() => import('@/components/UI/Minimal/pages/dashboard'));
const OverviewEcommercePage = lazy(() => import('@/components/UI/Minimal/pages/dashboard/ecommerce'));
const OverviewAnalyticsPage = lazy(() => import('@/components/UI/Minimal/pages/dashboard/analytics'));
const OverviewBankingPage = lazy(() => import('@/components/UI/Minimal/pages/dashboard/banking'));
const OverviewBookingPage = lazy(() => import('@/components/UI/Minimal/pages/dashboard/booking'));
const OverviewFilePage = lazy(() => import('@/components/UI/Minimal/pages/dashboard/file'));
const OverviewCoursePage = lazy(() => import('@/components/UI/Minimal/pages/dashboard/course'));
// Product
const ProductDetailsPage = lazy(() => import('@/components/UI/Minimal/pages/dashboard/product/details'));
const ProductListPage = lazy(() => import('@/components/UI/Minimal/pages/dashboard/product/list'));
const ProductCreatePage = lazy(() => import('@/components/UI/Minimal/pages/dashboard/product/new'));
const ProductEditPage = lazy(() => import('@/components/UI/Minimal/pages/dashboard/product/edit'));
// Order
const OrderListPage = lazy(() => import('@/components/UI/Minimal/pages/dashboard/order/list'));
const OrderDetailsPage = lazy(() => import('@/components/UI/Minimal/pages/dashboard/order/details'));
// Invoice
const InvoiceListPage = lazy(() => import('@/components/UI/Minimal/pages/dashboard/invoice/list'));
const InvoiceDetailsPage = lazy(() => import('@/components/UI/Minimal/pages/dashboard/invoice/details'));
const InvoiceCreatePage = lazy(() => import('@/components/UI/Minimal/pages/dashboard/invoice/new'));
const InvoiceEditPage = lazy(() => import('@/components/UI/Minimal/pages/dashboard/invoice/edit'));
// User
const UserProfilePage = lazy(() => import('@/components/UI/Minimal/pages/dashboard/user/profile'));
const UserCardsPage = lazy(() => import('@/components/UI/Minimal/pages/dashboard/user/cards'));
const UserListPage = lazy(() => import('@/components/UI/Minimal/pages/dashboard/user/list'));
const UserAccountPage = lazy(() => import('@/components/UI/Minimal/pages/dashboard/user/account'));
const UserCreatePage = lazy(() => import('@/components/UI/Minimal/pages/dashboard/user/new'));
const UserEditPage = lazy(() => import('@/components/UI/Minimal/pages/dashboard/user/edit'));
// Blog
const BlogPostsPage = lazy(() => import('@/components/UI/Minimal/pages/dashboard/post/list'));
const BlogPostPage = lazy(() => import('@/components/UI/Minimal/pages/dashboard/post/details'));
const BlogNewPostPage = lazy(() => import('@/components/UI/Minimal/pages/dashboard/post/new'));
const BlogEditPostPage = lazy(() => import('@/components/UI/Minimal/pages/dashboard/post/edit'));
// Job
const JobDetailsPage = lazy(() => import('@/components/UI/Minimal/pages/dashboard/job/details'));
const JobListPage = lazy(() => import('@/components/UI/Minimal/pages/dashboard/job/list'));
const JobCreatePage = lazy(() => import('@/components/UI/Minimal/pages/dashboard/job/new'));
const JobEditPage = lazy(() => import('@/components/UI/Minimal/pages/dashboard/job/edit'));
// Tour
const TourDetailsPage = lazy(() => import('@/components/UI/Minimal/pages/dashboard/tour/details'));
const TourListPage = lazy(() => import('@/components/UI/Minimal/pages/dashboard/tour/list'));
const TourCreatePage = lazy(() => import('@/components/UI/Minimal/pages/dashboard/tour/new'));
const TourEditPage = lazy(() => import('@/components/UI/Minimal/pages/dashboard/tour/edit'));
// File manager
const FileManagerPage = lazy(() => import('@/components/UI/Minimal/pages/dashboard/file-manager'));
// App
const ChatPage = lazy(() => import('@/components/UI/Minimal/pages/dashboard/chat'));
const MailPage = lazy(() => import('@/components/UI/Minimal/pages/dashboard/mail'));
const CalendarPage = lazy(() => import('@/components/UI/Minimal/pages/dashboard/calendar'));
const KanbanPage = lazy(() => import('@/components/UI/Minimal/pages/dashboard/kanban'));
// Test render page by role
const PermissionDeniedPage = lazy(() => import('@/components/UI/Minimal/pages/dashboard/permission'));
// Blank page
const ParamsPage = lazy(() => import('@/components/UI/Minimal/pages/dashboard/params'));
const BlankPage = lazy(() => import('@/components/UI/Minimal/pages/dashboard/blank'));

// ----------------------------------------------------------------------

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const dashboardRoutes = [
  {
    path: 'dashboard',
    //element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      { element: <IndexPage />, index: true },
      { path: 'ecommerce', element: <OverviewEcommercePage /> },
      { path: 'analytics', element: <OverviewAnalyticsPage /> },
      { path: 'banking', element: <OverviewBankingPage /> },
      { path: 'booking', element: <OverviewBookingPage /> },
      { path: 'file', element: <OverviewFilePage /> },
      { path: 'course', element: <OverviewCoursePage /> },
      {
        path: 'user',
        children: [
          { element: <UserProfilePage />, index: true },
          { path: 'profile', element: <UserProfilePage /> },
          { path: 'cards', element: <UserCardsPage /> },
          { path: 'list', element: <UserListPage /> },
          { path: 'new', element: <UserCreatePage /> },
          { path: ':id/edit', element: <UserEditPage /> },
          { path: 'account', element: <UserAccountPage /> },
        ],
      },
      {
        path: 'product',
        children: [
          { element: <ProductListPage />, index: true },
          { path: 'list', element: <ProductListPage /> },
          { path: ':id', element: <ProductDetailsPage /> },
          { path: 'new', element: <ProductCreatePage /> },
          { path: ':id/edit', element: <ProductEditPage /> },
        ],
      },
      {
        path: 'order',
        children: [
          { element: <OrderListPage />, index: true },
          { path: 'list', element: <OrderListPage /> },
          { path: ':id', element: <OrderDetailsPage /> },
        ],
      },
      {
        path: 'invoice',
        children: [
          { element: <InvoiceListPage />, index: true },
          { path: 'list', element: <InvoiceListPage /> },
          { path: ':id', element: <InvoiceDetailsPage /> },
          { path: ':id/edit', element: <InvoiceEditPage /> },
          { path: 'new', element: <InvoiceCreatePage /> },
        ],
      },
      {
        path: 'post',
        children: [
          { element: <BlogPostsPage />, index: true },
          { path: 'list', element: <BlogPostsPage /> },
          { path: ':title', element: <BlogPostPage /> },
          { path: ':title/edit', element: <BlogEditPostPage /> },
          { path: 'new', element: <BlogNewPostPage /> },
        ],
      },
      {
        path: 'job',
        children: [
          { element: <JobListPage />, index: true },
          { path: 'list', element: <JobListPage /> },
          { path: ':id', element: <JobDetailsPage /> },
          { path: 'new', element: <JobCreatePage /> },
          { path: ':id/edit', element: <JobEditPage /> },
        ],
      },
      {
        path: 'tour',
        children: [
          { element: <TourListPage />, index: true },
          { path: 'list', element: <TourListPage /> },
          { path: ':id', element: <TourDetailsPage /> },
          { path: 'new', element: <TourCreatePage /> },
          { path: ':id/edit', element: <TourEditPage /> },
        ],
      },
      { path: 'file-manager', element: <FileManagerPage /> },
      { path: 'mail', element: <MailPage /> },
      { path: 'chat', element: <ChatPage /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'kanban', element: <KanbanPage /> },
      { path: 'permission', element: <PermissionDeniedPage /> },
      { path: 'params', element: <ParamsPage /> },
      { path: 'blank', element: <BlankPage /> },
    ],
  },
];
