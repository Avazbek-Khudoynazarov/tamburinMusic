import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { _userList } from 'src/_mock/_user';

import { EditView } from 'src/sections/custom/curriculum/view';
import CurriculumService from 'src/services/CurriculumService';
import { ICurriculumItem } from 'src/types/user';
// ----------------------------------------------------------------------

export default function Page() {
  const [curriculum, setCurriculum] = useState<ICurriculumItem | undefined>(undefined);
  const { id = '' } = useParams();

  useEffect(() => {    
    CurriculumService.get(Number(id)).then((value) => {
      setCurriculum(value);
    })
  }, [id]);


  return (
    <>
      <EditView user={curriculum} />
    </>
  );
}
