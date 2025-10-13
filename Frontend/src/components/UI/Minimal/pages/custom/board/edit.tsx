import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { useParams } from '@/components/UI/Minimal/routes/hooks';

import * as CONFIG from '@/config';
import { _userList } from '@/components/UI/Minimal/_mock/_user';

import { EditView } from '@/components/UI/Minimal/sections/custom/board/view';
import BoardService from '@/services/BoardService';
import { IBoardItem } from '@/components/UI/Minimal/types/user';
// ----------------------------------------------------------------------

export default function Page() {
  const [board, setBoard] = useState<IBoardItem | undefined>(undefined);
  const { id = '' } = useParams();

  useEffect(() => {    
    BoardService.get(Number(id)).then((value) => {
      setBoard(value);
    })
  }, [id]);


  return (
    <>
      <EditView user={board} />
    </>
  );
}
