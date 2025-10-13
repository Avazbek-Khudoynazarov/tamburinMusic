import type { ITableFilters } from 'src/types/user';
import type { Theme, SxProps } from '@mui/material/styles';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';

import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

type Props = {
  totalResults: number;
  sx?: SxProps<Theme>;
  onResetPage: () => void;
  filters: UseSetStateReturn<ITableFilters>;
  onResetSearchValue: () => void;
};

export function CalendarSearchFiltersResult({ filters, onResetPage, totalResults, sx, onResetSearchValue }: Props) {
  const handleRemoveKeyword = useCallback(() => {
    onResetPage();
    filters.setState({ searchKeyword: '' });
    onResetSearchValue();
  }, [filters, onResetPage, onResetSearchValue]);

  const handleRemoveRoleCheck1 = useCallback(
    (inputValue: string) => {
      const newValue = filters.state.roleCheck1.filter((item) => item !== inputValue);

      onResetPage();
      filters.setState({ roleCheck1: newValue });
    },
    [filters, onResetPage]
  );

  const handleReset = useCallback(() => {
    onResetPage();
    filters.setState({
      ...filters.state,
      searchKeyword: '',
      roleCheck1: []
    });
    onResetSearchValue();
  }, [filters, onResetPage, onResetSearchValue]);

  return (
    <FiltersResult totalResults={totalResults} onReset={handleReset} sx={sx}>
      <FiltersBlock label="수업 상태:" isShow={!!filters.state.roleCheck1.length}>
        {filters.state.roleCheck1.map((item) => (
          <Chip {...chipProps} key={item} label={item} onDelete={() => handleRemoveRoleCheck1(item)} />
        ))}
      </FiltersBlock>

      <FiltersBlock label="검색어:" isShow={!!filters.state.searchKeyword}>
        <Chip {...chipProps} label={filters.state.searchKeyword} onDelete={handleRemoveKeyword} />
      </FiltersBlock>
    </FiltersResult>
  );
}
