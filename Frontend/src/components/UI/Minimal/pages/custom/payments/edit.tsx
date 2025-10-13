import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { useParams } from '@/components/UI/Minimal/routes/hooks';

import * as CONFIG from '@/config';
import { _userList } from '@/components/UI/Minimal/_mock/_user';

import { EditView } from '@/components/UI/Minimal/sections/custom/payments/view';
import PaymentsService from '@/services/PaymentsService';
import { IPaymentsItem } from '@/components/UI/Minimal/types/user';
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
