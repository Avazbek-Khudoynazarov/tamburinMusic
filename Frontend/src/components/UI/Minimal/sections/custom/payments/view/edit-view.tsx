import type { IPaymentsItem } from '@/components/UI/Minimal/types/user';

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
		label: '결제 정보',
		icon: <Iconify icon="solar:user-id-bold" width={24} />
	},
	{
		value: 'payments',
		label: '결제 내역',
		icon: <Iconify icon="solar:list-bold" width={24} />
	},
];

type Props = {
	user?: IPaymentsItem;
	classes_id?: number;
};

export function EditView({ user: currentItem, classes_id }: Props) {

	const tabs = useTabs('info');

	return (
		<DashboardContent>
			<CustomBreadcrumbs
				heading={currentItem ? '결제 수정' : '결제 등록'}
				links={[
					{ name: 'Home', href: '/' },
					{ name: '결제관리', href: '/payments/list' },
					{ name: currentItem ? '결제수정' : '결제등록' },
				]}
				sx={{ mb: { xs: 3, md: 5 } }}
			/>

			<NewEditForm currentItem={currentItem} classes_id={classes_id} />


		</DashboardContent>
	);
}
