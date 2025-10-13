import type { IClassesBoardItem } from 'src/types/user';

// 탭 구성
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useTabs } from 'src/hooks/use-tabs';
import { Iconify } from 'src/components/iconify';


import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { NewEditForm } from '../new-edit-form';
import { CourseWidgetSummary } from '../course-widget-summary';
// ----------------------------------------------------------------------


type Props = {
	user?: IClassesBoardItem;
};

export function EditView({ user: currentItem }: Props) {

	const tabs = useTabs('info');

	return (
		<DashboardContent>
			<CustomBreadcrumbs
				heading={currentItem ? '수업 게시글 수정' : '수업 게시글 등록'}
				links={[
					{ name: 'Home', href: '/' },
					{ name: '수업 게시글관리', href: '/classesboard/list' },
					{ name: currentItem ? '수업 게시글수정' : '수업 게시글등록' },
				]}
				sx={{ mb: { xs: 3, md: 5 } }}
			/>

			<NewEditForm currentItem={currentItem} />


		</DashboardContent>
	);
}
