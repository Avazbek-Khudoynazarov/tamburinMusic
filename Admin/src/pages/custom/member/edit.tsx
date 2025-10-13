import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { _userList } from 'src/_mock/_user';

import { EditView } from 'src/sections/custom/member/view';
import MemberService from 'src/services/MemberService';
import { IMemberItem } from 'src/types/user';
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
