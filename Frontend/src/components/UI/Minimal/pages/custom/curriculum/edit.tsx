import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { useParams } from '@/components/UI/Minimal/routes/hooks';

import * as CONFIG from '@/config';
import { _userList } from '@/components/UI/Minimal/_mock/_user';

import { EditView } from '@/components/UI/Minimal/sections/custom/curriculum/view';
import CurriculumService from '@/services/CurriculumService';
import { ICurriculumItem } from '@/components/UI/Minimal/types/user';
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
