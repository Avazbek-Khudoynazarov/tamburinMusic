import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { useParams } from '@/components/UI/Minimal/routes/hooks';

import * as CONFIG from '@/config';
import { _userList } from '@/components/UI/Minimal/_mock/_user';

import { EditView } from '@/components/UI/Minimal/sections/custom/instrument/view';
import InstrumentService from '@/services/InstrumentService';
import { IInstrumentItem } from '@/components/UI/Minimal/types/user';
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
