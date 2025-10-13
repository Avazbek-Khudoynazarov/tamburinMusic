import type { ICalendarFilters } from '@/components/UI/Minimal/types/calendar';
import type { Theme, SxProps } from '@mui/material/styles';
import type { UseSetStateReturn } from '@/components/UI/Minimal/hooks/use-set-state';

import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

import { fDateRangeShortLabel } from '@/utils/format-time';

import { varAlpha } from '@/components/UI/Minimal/theme/styles';

import { chipProps, FiltersBlock, FiltersResult } from '@/components/UI/Minimal/components/filters-result';

// ----------------------------------------------------------------------

type Props = {
  totalResults: number;
  sx?: SxProps<Theme>;
  filters: UseSetStateReturn<ICalendarFilters>;
};

export function CalendarFiltersResult({ filters, totalResults, sx }: Props) {
  const handleRemoveColor = useCallback(
    (inputValue: string) => {
      const newValue = filters.state.colors.filter((item) => item !== inputValue);

      filters.setState({ colors: newValue });
    },
    [filters]
  );

  const handleRemoveDate = useCallback(() => {
    filters.setState({ startDate: null, endDate: null });
  }, [filters]);

  return (
    <FiltersResult totalResults={totalResults} onReset={filters.onResetState} sx={sx}>
      <FiltersBlock label="Colors:" isShow={!!filters.state.colors.length}>
        {filters.state.colors.map((item) => (
          <Chip
            {...chipProps}
            key={item}
            label={
              <Box
                sx={{
                  ml: -0.5,
                  width: 18,
                  height: 18,
                  bgcolor: item,
                  borderRadius: '50%',
                  border: (theme) =>
                    `solid 1px ${varAlpha(theme.vars.palette.common.whiteChannel, 0.24)}`,
                }}
              />
            }
            onDelete={() => handleRemoveColor(item)}
          />
        ))}
      </FiltersBlock>

      <FiltersBlock
        label="날짜:"
        isShow={Boolean(filters.state.startDate && filters.state.endDate)}
      >
        <Chip
          {...chipProps}
          label={fDateRangeShortLabel(filters.state.startDate, filters.state.endDate)}
          onDelete={handleRemoveDate}
        />
      </FiltersBlock>
    </FiltersResult>
  );
}
