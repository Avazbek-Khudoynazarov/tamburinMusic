import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { _userList } from 'src/_mock/_user';

import { EditView } from 'src/sections/custom/payments/view';
import PaymentsService from 'src/services/PaymentsService';
import { IPaymentsItem } from 'src/types/user';
// ----------------------------------------------------------------------

export default function Page() {
  const [payments, setPayments] = useState<IPaymentsItem | undefined>(undefined);
  const { id = '', classes_id } = useParams();

  const numericClassesId = classes_id ? Number(classes_id) : undefined;

  useEffect(() => {    
    PaymentsService.get(Number(id)).then((value) => {
      setPayments(value);
    })
  }, [id]);


  return (
    <>
      <EditView user={payments} classes_id={numericClassesId} />
    </>
  );
}
