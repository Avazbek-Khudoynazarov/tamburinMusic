import { useState, useEffect } from 'react';
import type { IMemberItem } from 'src/types/user';
import ClassesService from 'src/services/ClassesService';

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
import { ListView } from '../payments/list-view';
import { CourseWidgetSummary } from '../course-widget-summary';


// ----------------------------------------------------------------------

const TABS = [
	{
		value: 'info',
		label: '강사 정보',
		icon: <Iconify icon="solar:user-id-bold" width={24} />
	},
	{
		value: 'payments',
		label: '수업 내역',
		icon: <Iconify icon="solar:list-bold" width={24} />
	},
];

type Props = {
	user?: IMemberItem;
};

export function EditView({ user: currentUser }: Props) {

	const tabs = useTabs('info');
	const [form, setForm] = useState({
		yearClasses: 0,
		monthClasses: 0,
		lastMonthClasses: 0,
	})


	useEffect(() => {


		async function loadInitialData() {
			if (currentUser?.id) {
				const count = await ClassesService.getCountClassesByTeacher(currentUser?.id!, 'YEAR');
				if (count) {
					setForm(prev => ({
						...prev,
						yearClasses: count.completed_class_count,
					}));
				}
				const count2 = await ClassesService.getCountClassesByTeacher(currentUser?.id!, 'LASTMONTH');
				if (count2) {
					setForm(prev => ({
						...prev,
						lastMonthClasses: count2.completed_class_count,
					}));
				}
				const count3 = await ClassesService.getCountClassesByTeacher(currentUser?.id!, 'MONTH');
				if (count3) {
					setForm(prev => ({
						...prev,
						monthClasses: count3.completed_class_count,
					}));
				}
			}
		}


		loadInitialData();

	}, [currentUser]);




	return (
		<DashboardContent>
			<CustomBreadcrumbs
				heading={currentUser ? '강사 수정' : '강사 등록'}
				links={[
					{ name: 'Home', href: '/' },
					{ name: '강사관리', href: '/member/list' },
					{ name: currentUser ? '강사수정' : '강사등록' },
				]}
				sx={{ mb: { xs: 3, md: 5 } }}
			/>

			{currentUser ? (
				<>
					<Box
						sx={{
							gap: 3,
							display: 'grid',
							gridTemplateColumns: {
								xs: 'repeat(1, 1fr)',
								md: 'repeat(3, 1fr)',
							},
							mx: 'auto',
							maxWidth: {
								xs: '100%',
								xl: 1200,
							},
							width: '100%',
						}}
					>

						<CourseWidgetSummary
							title="올해 수업횟수"
							total={Number(form.yearClasses.toLocaleString())}
							icon="/assets/icons/navbar/ic-analytics.svg"
						/>

						<CourseWidgetSummary
							title="지난달 수업횟수"
							total={Number(form.lastMonthClasses.toLocaleString())}
							color="success"
							icon="/assets/icons/navbar/ic-banking.svg"
						/>

						<CourseWidgetSummary
							title="이번달 수업횟수"
							total={Number(form.monthClasses.toLocaleString())}
							color="secondary"
							icon="/assets/icons/navbar/ic-calendar.svg"
						/>
					</Box>


					<Box
						sx={{
							mt: 3,
							pl: 1,
							mx: 'auto',
							maxWidth: {
								xs: '100%',
								xl: 1200,
							},
							width: '100%',
						}}
					>
						<Tabs value={tabs.value} onChange={tabs.onChange}>
							{TABS.map((tab) => (
								<Tab
									key={tab.value}
									value={tab.value}
									icon={tab.icon}
									label={
										<span style={{ fontWeight: 'bold' }}>
											{tab.label}
										</span>
									} />
							))}
						</Tabs>
					</Box>

					{tabs.value === 'info' && <NewEditForm currentUser={currentUser} />}

					{tabs.value === 'payments' && <ListView />}
				</>
			) : (
				<NewEditForm currentUser={currentUser} />
			)}



		</DashboardContent>
	);
}
