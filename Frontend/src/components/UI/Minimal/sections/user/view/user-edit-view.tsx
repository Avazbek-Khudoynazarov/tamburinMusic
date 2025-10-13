import type { IUserItem } from '@/components/UI/Minimal/types/user';

import { paths } from '@/components/UI/Minimal/routes/paths';

import { DashboardContent } from '@/components/UI/Minimal/layouts/dashboard';

import { CustomBreadcrumbs } from '@/components/UI/Minimal/components/custom-breadcrumbs';

import { UserNewEditForm } from '../user-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  user?: IUserItem;
};

export function UserEditView({ user: currentUser }: Props) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={currentUser ? '회원정보 수정' : '신규회원 생성'}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'User', href: paths.dashboard.user.root },
          { name: currentUser?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <UserNewEditForm currentUser={currentUser} />
    </DashboardContent>
  );
}
