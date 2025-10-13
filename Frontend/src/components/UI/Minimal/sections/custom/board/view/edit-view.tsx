import type { IBoardItem } from '@/components/UI/Minimal/types/user';

import { useParams } from '@/components/UI/Minimal/routes/hooks';

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


type Props = {
	user?: IBoardItem;
};

export function EditView({ user: currentItem }: Props) {

	const tabs = useTabs('info');

	const { type = '' } = useParams();
	const boardType = type === 'notice' ? '공지사항' : type === 'faq' ? '자주묻는질문' : '수강후기';

	return (
		<DashboardContent>
			<CustomBreadcrumbs
				heading={currentItem ? `${boardType} 수정` : `${boardType} 등록`}
				links={[
					{ name: 'Home', href: '/' },
					{ name: '게시글관리', href: '/board/list' },
					{ name: currentItem ? `${boardType}수정` : `${boardType}등록` },
				]}
				sx={{ mb: { xs: 3, md: 5 } }}
			/>

			<NewEditForm currentItem={currentItem} />


		</DashboardContent>
	);
}
