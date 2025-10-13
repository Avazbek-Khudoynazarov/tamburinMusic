import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { useParams } from '@/components/UI/Minimal/routes/hooks';

import * as CONFIG from '@/config';
import { _userList } from '@/components/UI/Minimal/_mock/_user';

import { EditView } from '@/components/UI/Minimal/sections/custom/popup/view';
import PopupService from '@/services/PopupService';
import { IPopupItem } from '@/components/UI/Minimal/types/user';
// ----------------------------------------------------------------------

export default function Page() {
  const [popup, setPopup] = useState<IPopupItem | undefined>(undefined);
  const { id = '' } = useParams();

  useEffect(() => {    
    PopupService.get(Number(id)).then((value) => {
      setPopup(value);
    })
  }, [id]);


  return (
    <>
      <EditView user={popup} />
    </>
  );
}
