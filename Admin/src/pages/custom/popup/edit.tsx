import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { _userList } from 'src/_mock/_user';

import { EditView } from 'src/sections/custom/popup/view';
import PopupService from 'src/services/PopupService';
import { IPopupItem } from 'src/types/user';
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
