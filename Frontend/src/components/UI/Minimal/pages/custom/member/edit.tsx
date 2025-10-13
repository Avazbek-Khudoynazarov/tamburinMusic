import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { useParams } from '@/components/UI/Minimal/routes/hooks';

import * as CONFIG from '@/config';
import { _userList } from '@/components/UI/Minimal/_mock/_user';

import { EditView } from '@/components/UI/Minimal/sections/custom/member/view';
import MemberService from '@/services/MemberService';
import { IMemberItem } from '@/components/UI/Minimal/types/user';
// ----------------------------------------------------------------------

export default function Page() {
  const [member, setMember] = useState<IMemberItem | undefined>(undefined);
  const { id = '' } = useParams();

  useEffect(() => {    
    MemberService.get(Number(id)).then((value) => {
      setMember(value);
    })
  }, [id]);


  return (
    <>
      <EditView user={member} />
    </>
  );
}
