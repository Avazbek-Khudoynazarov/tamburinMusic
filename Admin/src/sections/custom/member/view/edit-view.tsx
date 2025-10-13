import type { IMemberItem } from 'src/types/user';

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
		label: '회원 정보',
		icon: <Iconify icon="solar:user-id-bold" width={24} />
	},
	{
		value: 'payments',
		label: '결제 내역',
		icon: <Iconify icon="solar:list-bold" width={24} />
	},
];

type Props = {
	user?: IMemberItem;
};

export function EditView({ user: currentUser }: Props) {

	const tabs = useTabs('info');

	return (
		<DashboardContent>
			<CustomBreadcrumbs
				heading={currentUser ? '회원 수정' : '회원 등록'}
				links={[
					{ name: 'Home', href: '/' },
					{ name: '회원관리', href: '/member/list' },
					{ name: currentUser ? '회원수정' : '회원등록' },
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
							title="총 결제횟수"
							total={currentUser?.total_payments ? currentUser?.total_payments : 0}
							color="success"
							icon="/assets/icons/navbar/ic-banking.svg"
						/>

						<CourseWidgetSummary
							title="총 결제금액"
							total={currentUser?.total_price ? currentUser?.total_price : 0}
							icon="/assets/icons/navbar/ic-analytics.svg"
						/>

						<CourseWidgetSummary
							title="남은 수업횟수"
							total={currentUser?.remaining_classes ? currentUser?.remaining_classes : 0}
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
