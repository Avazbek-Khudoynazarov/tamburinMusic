import { Helmet } from 'react-helmet-async';

import * as CONFIG from '@/config';

import { AutocompleteView } from '@/components/UI/Minimal/sections/_examples/mui/autocomplete-view';

// ----------------------------------------------------------------------

const metadata = { title: `Autocomplete | MUI - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AutocompleteView />
    </>
  );
}
