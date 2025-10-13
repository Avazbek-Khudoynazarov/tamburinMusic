import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { useParams } from '@/components/UI/Minimal/routes/hooks';

import * as CONFIG from '@/config';
import { _userList } from '@/components/UI/Minimal/_mock/_user';

import { EditView } from '@/components/UI/Minimal/sections/custom/classesBoard/view';
import ClassesBoardService from '@/services/ClassesBoardService';
import { IClassesBoardItem } from '@/components/UI/Minimal/types/user';
// ----------------------------------------------------------------------

export default function Page() {
  const [classesBoard, setClassesBoard] = useState<IClassesBoardItem | undefined>(undefined);
  const { id = '' } = useParams();

  useEffect(() => {    
    ClassesBoardService.get(Number(id)).then((value) => {
      setClassesBoard(value);
    })
  }, [id]);


  return (
    <>
      <EditView user={classesBoard} />
    </>
  );
}
