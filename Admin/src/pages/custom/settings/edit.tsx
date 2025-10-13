import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { _userList } from 'src/_mock/_user';

import { EditView } from 'src/sections/custom/settings/view';
import MetaService from 'src/services/MetaService';
// ----------------------------------------------------------------------

export default function Page() {

  return (
    <>
      <EditView />
    </>
  );
}
