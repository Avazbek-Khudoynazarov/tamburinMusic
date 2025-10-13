import { useEffect, useState } from 'react';
import { Member } from '@/models/member';
import MemberTable from './MemberTable';

import MemberService from '@/services/MemberService';

function MemberManagement() {
  const [memberCount, setMemberCount] = useState<number>(0);
  const [memberList, setMemberList] = useState<Member[]>([]);

  useEffect(() => {
    loadMemberList(1);
  }, []);

  function onRefresh(page: number = 1) {
    loadMemberList(page);
  }

  function loadMemberList(page: number) {
    MemberService.getList(page).then((data) => {
      if(data) {
        setMemberCount(data.length);
        setMemberList(data);
      }
    });
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <MemberTable memberCount={memberCount} memberList={memberList} onRefresh={onRefresh}/>
    </div>
  );
}

export default MemberManagement;
