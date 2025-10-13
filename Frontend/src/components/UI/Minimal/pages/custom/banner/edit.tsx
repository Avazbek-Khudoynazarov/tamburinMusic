import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { useParams } from '@/components/UI/Minimal/routes/hooks';

import * as CONFIG from '@/config';
import { _userList } from '@/components/UI/Minimal/_mock/_user';

import { EditView } from '@/components/UI/Minimal/sections/custom/banner/view';
import MetaService from '@/services/MetaService';
// ----------------------------------------------------------------------

export default function Page() {

  return (
    <>
      <EditView />
    </>
  );
}
