import type { IBannerItem } from '@/components/UI/Minimal/types/user';

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
import { NewEditForm2 } from '../new-edit-form2';
import { NewEditForm3 } from '../new-edit-form3';
// ----------------------------------------------------------------------

const TABS = [
	{
		value: 'banner1',
		label: '메인페이지 슬라이드1',
	},
	{
		value: 'banner2',
		label: '메인페이지 슬라이드2',
	},
	{
		value: 'banner3',
		label: '메인페이지 리뷰관리',
	},
];

export function EditView() {

	const tabs = useTabs('banner1');

	return (
		<DashboardContent>
			<CustomBreadcrumbs
				heading='배너 관리'
				links={[
					{ name: 'Home', href: '/' },
					{ name: '배너관리' },
				]}
				sx={{ mb: { xs: 3, md: 5 } }}
			/>


			<>
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
								label={
									<span style={{ fontWeight: 'bold' }}>
										{tab.label}
									</span>
								} />
						))}
					</Tabs>
				</Box>

				{tabs.value === 'banner1' && <NewEditForm />}

				{tabs.value === 'banner2' && <NewEditForm2 />}

				{tabs.value === 'banner3' && <NewEditForm3 />}
			</>



		</DashboardContent>
	);
}
