import type { ITableFilters } from 'src/types/user';
import type { Theme, SxProps } from '@mui/material/styles';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';

import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';
import { fDateRangeShortLabel } from 'src/utils/format-time';

const STATUS_OPTIONS = [
  { value: '10', label: '수업 게시글대기' },
  { value: '20', label: '수업 게시글완료' },
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

      <FiltersBlock label="검색어:" isShow={!!filters.state.searchKeyword}>
        <Chip {...chipProps} label={filters.state.searchKeyword} onDelete={handleRemoveKeyword} />
      </FiltersBlock>
    </FiltersResult>
  );
}
