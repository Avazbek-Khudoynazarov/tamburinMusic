import type { ITableFilters } from '@/components/UI/Minimal/types/user';
import type { Theme, SxProps } from '@mui/material/styles';
import type { UseSetStateReturn } from '@/components/UI/Minimal/hooks//use-set-state';

import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from '@/components/UI/Minimal/components/filters-result';
import { fDateRangeShortLabel } from '@/utils/format-time';

const STATUS_OPTIONS = [
  { value: '10', label: '커리큘럼대기' },
  { value: '20', label: '커리큘럼완료' },
  { value: 'all', label: '전체' },
] as const; 

// ----------------------------------------------------------------------

type Props = {
  totalResults: number;
  sx?: SxProps<Theme>;
  onResetPage: () => void;
  filters: UseSetStateReturn<ITableFilters>;
};

export function ListTableFiltersResult({ filters, onResetPage, totalResults, sx }: Props) {
  const handleRemoveKeyword = useCallback(() => {
    onResetPage();
    filters.setState({ searchKeyword: '' });
  }, [filters, onResetPage]);

  const handleRemoveStatus = useCallback(() => {
    onResetPage();
    filters.setState({ status: 'all' });
  }, [filters, onResetPage]);

  const handleRemoveRoleCheck1 = useCallback(
    (inputValue: string) => {
      const newValue = filters.state.roleCheck1.filter((item) => item !== inputValue);

      onResetPage();
      filters.setState({ roleCheck1: newValue });
    },
    [filters, onResetPage]
  );

  const handleRemoveRoleCheck2 = useCallback(
    (inputValue: string) => {
      const newValue = filters.state.roleCheck2.filter((item) => item !== inputValue);

      onResetPage();
      filters.setState({ roleCheck2: newValue });
    },
    [filters, onResetPage]
  );

  const handleReset = useCallback(() => {
    onResetPage();
    filters.onResetState();
  }, [filters, onResetPage]);

  const handleRemoveDate = useCallback(() => {
    onResetPage();
    filters.setState({ startDate: null, endDate: null });
  }, [filters, onResetPage]);

  
  return (
    <FiltersResult totalResults={totalResults} onReset={handleReset} sx={sx}>
			{/* 구분탭 */}
      <FiltersBlock label="Status:" isShow={filters.state.status !== 'all'}>
        <Chip
          {...chipProps}
          label={STATUS_OPTIONS.find((option) => option.value === filters.state.status)?.label}
          onDelete={handleRemoveStatus}
          sx={{ textTransform: 'capitalize' }}
        />
      </FiltersBlock>

			{/* 체크박스1 */}
      <FiltersBlock label="악기:" isShow={!!filters.state.roleCheck1.length}>
        {filters.state.roleCheck1.map((item) => (
          <Chip {...chipProps} key={item} label={item} onDelete={() => handleRemoveRoleCheck1(item)} />
        ))}
      </FiltersBlock>

    </FiltersResult>
  );
}
