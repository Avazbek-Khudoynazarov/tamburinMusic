import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { StepperView } from '@/components/UI/Minimal/sections/_examples/mui/stepper-view';

// ----------------------------------------------------------------------

const metadata = { title: `Stepper | MUI - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <StepperView />
    </>
  );
}
