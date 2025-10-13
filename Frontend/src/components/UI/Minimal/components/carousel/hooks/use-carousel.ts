import type { EmblaPluginType } from 'embla-carousel';

import { useMemo } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

import { useThumbs } from './use-thumbs';
import { useCarouselDots } from './use-carousel-dots';
import { useParallax } from './use-carousel-parallax';
import { useCarouselArrows } from './use-carousel-arrows';
import { useCarouselProgress } from './use-carousel-progress';
import { useCarouselAutoPlay } from './use-carousel-auto-play';
import { useCarouselAutoScroll } from './use-carousel-auto-scroll';

import type { CarouselOptions, UseCarouselReturn } from '../types';

// ----------------------------------------------------------------------

export const useCarousel = (
  options?: CarouselOptions,
  plugins?: EmblaPluginType[]
): UseCarouselReturn => {
  const [mainRef, mainApi] = useEmblaCarousel(options as any, plugins as any);

  const { disablePrev, disableNext, onClickPrev, onClickNext } = useCarouselArrows(mainApi as any);

  const pluginNames = plugins?.map((plugin) => plugin.name);

  const _dots = useCarouselDots(mainApi as any);

  const _autoplay = useCarouselAutoPlay(mainApi as any);

  const _autoScroll = useCarouselAutoScroll(mainApi as any);

  const _progress = useCarouselProgress(mainApi as any);

  const _thumbs = useThumbs(mainApi as any, options?.thumbs);

  useParallax(mainApi as any, options?.parallax);

  const controls = useMemo(() => {
    if (pluginNames?.includes('autoplay')) {
      return {
        onClickPrev: () => _autoplay.onClickAutoplay(onClickPrev),
        onClickNext: () => _autoplay.onClickAutoplay(onClickNext),
      };
    }
    if (pluginNames?.includes('autoScroll')) {
      return {
        onClickPrev: () => _autoScroll.onClickAutoplay(onClickPrev),
        onClickNext: () => _autoScroll.onClickAutoplay(onClickNext),
      };
    }
    return {
      onClickPrev,
      onClickNext,
    };
  }, [_autoScroll, _autoplay, onClickNext, onClickPrev, pluginNames]);

  return {
    //options: {
      //...options,
      //...mainApi?.internalEngine().options,
    //},
    pluginNames,
    mainRef,
    //mainApi,
    // arrows
    arrows: {
      disablePrev,
      disableNext,
      onClickPrev: controls.onClickPrev,
      onClickNext: controls.onClickNext,
    },
    // dots
    dots: _dots,
    // thumbs
    thumbs: _thumbs,
    // progress
    progress: _progress,
    // autoplay
    autoplay: _autoplay,
    autoScroll: _autoScroll,
  };
};
