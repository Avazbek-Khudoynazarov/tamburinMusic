import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
	job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
};

// ----------------------------------------------------------------------

export const navData = [
  /**
   * Management
   */
  {
    subheader: 'member',
    items: [
      { icon: ICONS.user, title: '회원 관리', path: paths.member.list },
      { icon: ICONS.blog, title: '강사 관리', path: paths.teacher.list },
    ],
  },
  {
    subheader: 'product',
    items: [
      { icon: ICONS.banking, title: '악기 관리', path: paths.instrument.list },
      { icon: ICONS.course, title: '커리큘럼 관리', path: paths.curriculum.list },
    ],
  },
  {
    subheader: 'payment',
    items: [
      { icon: ICONS.analytics, title: '수업 결제관리', path: paths.payments.list },
      { icon: ICONS.invoice, title: '강사 정산관리', path: paths.calculate },
    ],
  },
  {
    subheader: 'class',
    items: [
      { icon: ICONS.calendar, title: '수업 스케쥴 관리', path: paths.calendar },
      { icon: ICONS.menuItem, title: '수업 게시판 관리', path: paths.classesBoard.list },
      { icon: ICONS.chat, title: '실시간 대화 관리', path: paths.chat },
    ],
  },
  {
    subheader: 'setting',
    items: [
      { icon: ICONS.parameter, title: '사이트 정보관리', path: paths.settings },
      { icon: ICONS.file, title: '배너 관리', path: paths.banner },
      { icon: ICONS.external, title: '팝업 관리', path: paths.popup.list },
    ],
  },
  {
    subheader: 'board',
    items: [
      { icon: ICONS.menuItem, title: '공지사항 관리', path: paths.board.notice.list },
      { icon: ICONS.menuItem, title: '자주묻는질문 관리', path: paths.board.faq.list },
      { icon: ICONS.menuItem, title: '수강후기 관리', path: paths.board.review.list },
    ],
  },
];
