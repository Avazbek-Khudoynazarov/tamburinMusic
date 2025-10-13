import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { _userList } from 'src/_mock/_user';

import { EditView } from 'src/sections/custom/board/view';
import BoardService from 'src/services/BoardService';
import { IBoardItem } from 'src/types/user';
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
