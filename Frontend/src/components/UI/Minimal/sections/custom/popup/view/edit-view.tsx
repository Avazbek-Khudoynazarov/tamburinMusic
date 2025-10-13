import type { IPopupItem } from '@/components/UI/Minimal/types/user';

// 탭 구성
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useTabs } from '@/components/UI/Minimal/hooks//use-tabs';
import { Iconify } from '@/components/UI/Minimal/components/iconify';


import { paths } from '@/components/UI/Minimal/routes/paths';
import { DashboardContent } from '@/components/UI/Minimal/layouts/dashboard';
import { CustomBreadcrumbs } from '@/components/UI/Minimal/components/custom-breadcrumbs';

import { NewEditForm } from '../new-edit-form';
import { CourseWidgetSummary } from '../course-widget-summary';
// ----------------------------------------------------------------------

const TABS = [
	{
		value: 'info',
		label: '팝업 정보',
		icon: <Iconify icon="solar:user-id-bold" width={24} />
	},
	{
		value: 'popup',
		label: '팝업 내역',
		icon: <Iconify icon="solar:list-bold" width={24} />
	},
];

type Props = {
	user?: IPopupItem;
};

export function EditView({ user: currentItem }: Props) {

	const tabs = useTabs('info');

	return (
		<DashboardContent>
			<CustomBreadcrumbs
				heading={currentItem ? '팝업 수정' : '팝업 등록'}
				links={[
					{ name: 'Home', href: '/' },
					{ name: '팝업관리', href: '/popup/list' },
					{ name: currentItem ? '팝업수정' : '팝업등록' },
				]}
				sx={{ mb: { xs: 3, md: 5 } }}
			/>

			<NewEditForm currentItem={currentItem} />


		</DashboardContent>
	);
}
