import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { _userList } from 'src/_mock/_user';

import { EditView } from 'src/sections/custom/instrument/view';
import InstrumentService from 'src/services/InstrumentService';
import { IInstrumentItem } from 'src/types/user';
// ----------------------------------------------------------------------

export default function Page() {
  const [instrument, setInstrument] = useState<IInstrumentItem | undefined>(undefined);
  const { id = '' } = useParams();

  useEffect(() => {    
    InstrumentService.get(Number(id)).then((value) => {
      setInstrument(value);
    })
  }, [id]);


  return (
    <>
      <EditView user={instrument} />
    </>
  );
}
