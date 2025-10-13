import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { AccordionView } from '@/components/UI/Minimal/sections/_examples/mui/accordion-view';

// ----------------------------------------------------------------------

const metadata = { title: `Accordion | MUI - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AccordionView />
    </>
  );
}
