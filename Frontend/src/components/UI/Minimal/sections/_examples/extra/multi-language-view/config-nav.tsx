import type { TFunction } from 'i18next';

import { paths } from '@/components/UI/Minimal/routes/paths';

import * as CONFIG from '@/config';

import { Label } from '@/components/UI/Minimal/components/label';
import { Iconify } from '@/components/UI/Minimal/components/iconify';
import { SvgColor } from '@/components/UI/Minimal/components/svg-color';

// ----------------------------------------------------------------------

export function navData(t: TFunction<any, any>) {
  return [
    {
      subheader: t('subheader'),
      items: [
        {
          title: t('app'),
          path: paths.dashboard.permission,
          icon: <SvgColor src={`/assets/icons/navbar/ic-invoice.svg`} />,
        },
        {
          title: t('travel'),
          path: '#disabled',
          icon: <SvgColor src={`/assets/icons/navbar/ic-tour.svg`} />,
        },
        {
          title: t('job'),
          path: '#label',
          icon: <SvgColor src={`/assets/icons/navbar/ic-job.svg`} />,
          info: (
            <Label
              color="info"
              variant="inverted"
              startIcon={<Iconify icon="solar:bell-bing-bold-duotone" />}
            >
              NEW
            </Label>
          ),
        },
        {
          title: t('blog.title'),
          path: '#caption',
          icon: <SvgColor src={`/assets/icons/navbar/ic-blog.svg`} />,
          caption: t('blog.caption'),
        },
        {
          title: t('user'),
          path: 'https://www.google.com/',
          icon: <SvgColor src={`/assets/icons/navbar/ic-user.svg`} />,
        },
        {
          title: t('invoice'),
          path: paths.dashboard.blank,
          icon: <SvgColor src={`/assets/icons/navbar/ic-invoice.svg`} />,
        },
      ],
    },
  ];
}
