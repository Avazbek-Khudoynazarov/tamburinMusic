import type { MapRef, MapProps } from 'react-map-gl';

//import MapGL from 'react-map-gl';
import { forwardRef } from 'react';

import * as CONFIG from '@/config';

// ----------------------------------------------------------------------

export const Map = forwardRef<MapRef, MapProps>(({ ...other }, ref) => (
  //<MapGL ref={ref} mapboxAccessToken={/*CONFIG.mapboxApiKey*/ ''} {...other} />
  <></>
));
