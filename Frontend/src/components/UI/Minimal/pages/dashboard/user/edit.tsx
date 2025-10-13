import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { useParams } from '@/components/UI/Minimal/routes/hooks';

import * as CONFIG from '@/config';
import { _userList } from '@/components/UI/Minimal/_mock/_user';

import { IUserItem } from '@/components/UI/Minimal/types/user';
import { UserEditView } from '@/components/UI/Minimal/sections/user/view';

// ----------------------------------------------------------------------

const metadata = { title: `User edit | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const [member, setMember] = useState<IUserItem | undefined>(undefined);
  const { id = '' } = useParams();

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <UserEditView user={member} />
    </>
  );
}
