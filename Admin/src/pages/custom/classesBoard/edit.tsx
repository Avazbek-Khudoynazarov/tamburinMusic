import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { _userList } from 'src/_mock/_user';

import { EditView } from 'src/sections/custom/classesBoard/view';
import ClassesBoardService from 'src/services/ClassesBoardService';
import { IClassesBoardItem } from 'src/types/user';
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
