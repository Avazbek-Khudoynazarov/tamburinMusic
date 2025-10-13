import { lazy, Suspense } from 'react';
import { Outlet, Navigate } from 'react-router-dom';

import { MainLayout } from '@/components/UI/Minimal/layouts/main';

import { SplashScreen } from '@/components/UI/Minimal/components/loading-screen';

// ----------------------------------------------------------------------

const IndexPage = lazy(() => import('@/components/UI/Minimal/pages/components'));

// Foundation
const GridPage = lazy(() => import('@/components/UI/Minimal/pages/components/foundation/grid'));
const IconsPage = lazy(() => import('@/components/UI/Minimal/pages/components/foundation/icons'));
const ColorsPage = lazy(() => import('@/components/UI/Minimal/pages/components/foundation/colors'));
const ShadowsPage = lazy(() => import('@/components/UI/Minimal/pages/components/foundation/shadows'));
const TypographyPage = lazy(() => import('@/components/UI/Minimal/pages/components/foundation/typography'));

// MUI components
const ChipPage = lazy(() => import('@/components/UI/Minimal/pages/components/mui/chip'));
const ListPage = lazy(() => import('@/components/UI/Minimal/pages/components/mui/list'));
const MenuPage = lazy(() => import('@/components/UI/Minimal/pages/components/mui/menu'));
const TabsPage = lazy(() => import('@/components/UI/Minimal/pages/components/mui/tabs'));
const AlertPage = lazy(() => import('@/components/UI/Minimal/pages/components/mui/alert'));
const BadgePage = lazy(() => import('@/components/UI/Minimal/pages/components/mui/badge'));
const TablePage = lazy(() => import('@/components/UI/Minimal/pages/components/mui/table'));
const AvatarPage = lazy(() => import('@/components/UI/Minimal/pages/components/mui/avatar'));
const DialogPage = lazy(() => import('@/components/UI/Minimal/pages/components/mui/dialog'));
const RatingPage = lazy(() => import('@/components/UI/Minimal/pages/components/mui/rating'));
const SliderPage = lazy(() => import('@/components/UI/Minimal/pages/components/mui/slider'));
const SwitchPage = lazy(() => import('@/components/UI/Minimal/pages/components/mui/switch'));
const ButtonsPage = lazy(() => import('@/components/UI/Minimal/pages/components/mui/buttons'));
const PickersPage = lazy(() => import('@/components/UI/Minimal/pages/components/mui/pickers'));
const PopoverPage = lazy(() => import('@/components/UI/Minimal/pages/components/mui/popover'));
const StepperPage = lazy(() => import('@/components/UI/Minimal/pages/components/mui/stepper'));
const TooltipPage = lazy(() => import('@/components/UI/Minimal/pages/components/mui/tooltip'));
const CheckboxPage = lazy(() => import('@/components/UI/Minimal/pages/components/mui/checkbox'));
const ProgressPage = lazy(() => import('@/components/UI/Minimal/pages/components/mui/progress'));
const TimelinePage = lazy(() => import('@/components/UI/Minimal/pages/components/mui/timeline'));
const DataGridPage = lazy(() => import('@/components/UI/Minimal/pages/components/mui/data-grid'));
const TreeViewPage = lazy(() => import('@/components/UI/Minimal/pages/components/mui/tree-view'));
const AccordionPage = lazy(() => import('@/components/UI/Minimal/pages/components/mui/accordion'));
const TextFieldPage = lazy(() => import('@/components/UI/Minimal/pages/components/mui/textfield'));
const PaginationPage = lazy(() => import('@/components/UI/Minimal/pages/components/mui/pagination'));
const BreadcrumbsPage = lazy(() => import('@/components/UI/Minimal/pages/components/mui/breadcrumbs'));
const AutocompletePage = lazy(() => import('@/components/UI/Minimal/pages/components/mui/autocomplete'));
const RadioButtonsPage = lazy(() => import('@/components/UI/Minimal/pages/components/mui/radio-button'));
const TransferListPage = lazy(() => import('@/components/UI/Minimal/pages/components/mui/transfer-list'));

// Extra components
const MapPage = lazy(() => import('@/components/UI/Minimal/pages/components/extra/map'));
const DndPage = lazy(() => import('@/components/UI/Minimal/pages/components/extra/dnd'));
const ChartPage = lazy(() => import('@/components/UI/Minimal/pages/components/extra/chart'));
const ImagePage = lazy(() => import('@/components/UI/Minimal/pages/components/extra/image'));
const LabelPage = lazy(() => import('@/components/UI/Minimal/pages/components/extra/label'));
const EditorPage = lazy(() => import('@/components/UI/Minimal/pages/components/extra/editor'));
const UploadPage = lazy(() => import('@/components/UI/Minimal/pages/components/extra/upload'));
const AnimatePage = lazy(() => import('@/components/UI/Minimal/pages/components/extra/animate'));
const ScrollbarPage = lazy(() => import('@/components/UI/Minimal/pages/components/extra/scroll'));
const LightboxPage = lazy(() => import('@/components/UI/Minimal/pages/components/extra/lightbox'));
const SnackbarPage = lazy(() => import('@/components/UI/Minimal/pages/components/extra/snackbar'));
const MarkdownPage = lazy(() => import('@/components/UI/Minimal/pages/components/extra/markdown'));
const WalktourPage = lazy(() => import('@/components/UI/Minimal/pages/components/extra/walktour'));
const CarouselsPage = lazy(() => import('@/components/UI/Minimal/pages/components/extra/carousel'));
const MegaMenuPage = lazy(() => import('@/components/UI/Minimal/pages/components/extra/mega-menu'));
const UtilitiesPage = lazy(() => import('@/components/UI/Minimal/pages/components/extra/utilities'));
const FormWizardPage = lazy(() => import('@/components/UI/Minimal/pages/components/extra/form-wizard'));
const OrgChartPage = lazy(() => import('@/components/UI/Minimal/pages/components/extra/organization-chart'));
const MultiLanguagePage = lazy(() => import('@/components/UI/Minimal/pages/components/extra/multi-language'));
const NavigationBarPage = lazy(() => import('@/components/UI/Minimal/pages/components/extra/navigation-bar'));
const FormValidationPage = lazy(() => import('@/components/UI/Minimal/pages/components/extra/form-validation'));
const ScrollProgressPage = lazy(() => import('@/components/UI/Minimal/pages/components/extra/scroll-progress'));

// ----------------------------------------------------------------------

export const componentsRoutes = [
  {
    element: (
      <Suspense fallback={<SplashScreen />}>
        <MainLayout>
          <Outlet />
        </MainLayout>
      </Suspense>
    ),
    children: [
      {
        path: 'components',
        children: [
          { element: <IndexPage />, index: true },
          {
            path: 'foundation',
            children: [
              {
                element: <Navigate to="/components/foundation/colors" replace />,
                index: true,
              },
              { path: 'grid', element: <GridPage /> },
              { path: 'icons', element: <IconsPage /> },
              { path: 'colors', element: <ColorsPage /> },
              { path: 'shadows', element: <ShadowsPage /> },
              { path: 'typography', element: <TypographyPage /> },
            ],
          },
          {
            path: 'mui',
            children: [
              {
                element: <Navigate to="/components/mui/accordion" replace />,
                index: true,
              },
              { path: 'chip', element: <ChipPage /> },
              { path: 'list', element: <ListPage /> },
              { path: 'menu', element: <MenuPage /> },
              { path: 'tabs', element: <TabsPage /> },
              { path: 'alert', element: <AlertPage /> },
              { path: 'badge', element: <BadgePage /> },
              { path: 'table', element: <TablePage /> },
              { path: 'avatar', element: <AvatarPage /> },
              { path: 'dialog', element: <DialogPage /> },
              { path: 'rating', element: <RatingPage /> },
              { path: 'slider', element: <SliderPage /> },
              { path: 'switch', element: <SwitchPage /> },
              { path: 'buttons', element: <ButtonsPage /> },
              { path: 'pickers', element: <PickersPage /> },
              { path: 'popover', element: <PopoverPage /> },
              { path: 'stepper', element: <StepperPage /> },
              { path: 'tooltip', element: <TooltipPage /> },
              { path: 'checkbox', element: <CheckboxPage /> },
              { path: 'progress', element: <ProgressPage /> },
              { path: 'timeline', element: <TimelinePage /> },
              { path: 'data-grid', element: <DataGridPage /> },
              { path: 'tree-view', element: <TreeViewPage /> },
              { path: 'accordion', element: <AccordionPage /> },
              { path: 'textfield', element: <TextFieldPage /> },
              { path: 'pagination', element: <PaginationPage /> },
              { path: 'breadcrumbs', element: <BreadcrumbsPage /> },
              { path: 'autocomplete', element: <AutocompletePage /> },
              { path: 'radio-button', element: <RadioButtonsPage /> },
              { path: 'transfer-list', element: <TransferListPage /> },
            ],
          },
          {
            path: 'extra',
            children: [
              {
                element: <Navigate to="/components/extra/animate" replace />,
                index: true,
              },
              { path: 'map', element: <MapPage /> },
              { path: 'dnd', element: <DndPage /> },
              { path: 'chart', element: <ChartPage /> },
              { path: 'image', element: <ImagePage /> },
              { path: 'label', element: <LabelPage /> },
              { path: 'editor', element: <EditorPage /> },
              { path: 'upload', element: <UploadPage /> },
              { path: 'animate', element: <AnimatePage /> },
              { path: 'scroll', element: <ScrollbarPage /> },
              { path: 'lightbox', element: <LightboxPage /> },
              { path: 'snackbar', element: <SnackbarPage /> },
              { path: 'markdown', element: <MarkdownPage /> },
              { path: 'walktour', element: <WalktourPage /> },
              { path: 'carousel', element: <CarouselsPage /> },
              { path: 'mega-menu', element: <MegaMenuPage /> },
              { path: 'utilities', element: <UtilitiesPage /> },
              { path: 'form-wizard', element: <FormWizardPage /> },
              { path: 'organization-chart', element: <OrgChartPage /> },
              { path: 'multi-language', element: <MultiLanguagePage /> },
              { path: 'navigation-bar', element: <NavigationBarPage /> },
              { path: 'form-validation', element: <FormValidationPage /> },
              { path: 'scroll-progress', element: <ScrollProgressPage /> },
            ],
          },
        ],
      },
    ],
  },
];
