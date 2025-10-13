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
// ----------------------------------------------------------------------


export function EditView() {

	const tabs = useTabs('info');

	return (
		<DashboardContent>
			<CustomBreadcrumbs
				heading='사이트정보 관리'
				links={[
					{ name: 'Home', href: '/' },
					{ name: '사이트정보 관리'},
				]}
				sx={{ mb: { xs: 3, md: 5 } }}
			/>

			<NewEditForm />


		</DashboardContent>
	);
}
