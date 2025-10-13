import { Helmet } from 'react-helmet-async';

import { useParams } from '@/components/UI/Minimal/routes/hooks';

import { _tours } from '@/components/UI/Minimal/_mock/_tour';
import * as CONFIG from '@/config';

import { TourDetailsView } from '@/components/UI/Minimal/sections/tour/view';

// ----------------------------------------------------------------------

const metadata = { title: `Tour details | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const currentTour = _tours.find((tour) => tour.id === id);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TourDetailsView tour={currentTour} />
    </>
  );
}
