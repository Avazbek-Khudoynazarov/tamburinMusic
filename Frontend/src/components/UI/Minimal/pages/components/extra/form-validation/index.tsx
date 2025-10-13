import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { FormValidationView } from '@/components/UI/Minimal/sections/_examples/extra/form-validation-view';

// ----------------------------------------------------------------------

const metadata = { title: `Form validation | Components - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <FormValidationView />
    </>
  );
}
