import type { IUserTableFilters } from '@/components/UI/Minimal/types/user';
import type { Theme, SxProps } from '@mui/material/styles';
import type { UseSetStateReturn } from '@/components/UI/Minimal/hooks//use-set-state';

import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from '@/components/UI/Minimal/components/filters-result';
import { STATUS_OPTIONS } from '@/components/UI/Minimal/constants/user';
import { fDateRangeShortLabel } from '@/utils/format-time';

// ----------------------------------------------------------------------

type Props = {
  totalResults: number;
  sx?: SxProps<Theme>;
  onResetPage: () => void;
  filters: UseSetStateReturn<IUserTableFilters>;
};

export function UserTableFiltersResult({ filters, onResetPage, totalResults, sx }: Props) {
  const handleRemoveKeyword = useCallback(() => {
    onResetPage();
    filters.setState({ searchKeyword: '' });
  }, [filters, onResetPage]);

  const handleRemoveStatus = useCallback(() => {
    onResetPage();
    filters.setState({ status: 'all' });
  }, [filters, onResetPage]);

  const handleRemoveRoleType = useCallback(
    (inputValue: string) => {
      const newValue = filters.state.roleType.filter((item) => item !== inputValue);

      onResetPage();
      filters.setState({ roleType: newValue });
    },
    [filters, onResetPage]
  );

  const handleRemoveRoleMarketing = useCallback(
    (inputValue: string) => {
      const newValue = filters.state.roleMarketing.filter((item) => item !== inputValue);

      onResetPage();
      filters.setState({ roleMarketing: newValue });
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
      <FiltersBlock label="Status:" isShow={filters.state.status !== 'all'}>
        <Chip
          {...chipProps}
          label={STATUS_OPTIONS.find((option) => option.value === filters.state.status)?.label}
          onDelete={handleRemoveStatus}
          sx={{ textTransform: 'capitalize' }}
        />
      </FiltersBlock>

      <FiltersBlock label="회원구분:" isShow={!!filters.state.roleType.length}>
        {filters.state.roleType.map((item) => (
          <Chip {...chipProps} key={item} label={item} onDelete={() => handleRemoveRoleType(item)} />
        ))}
      </FiltersBlock>

      <FiltersBlock label="마케팅 동의:" isShow={!!filters.state.roleMarketing.length}>
        {filters.state.roleMarketing.map((item) => (
          <Chip {...chipProps} key={item} label={item} onDelete={() => handleRemoveRoleMarketing(item)} />
        ))}
      </FiltersBlock>

      <FiltersBlock
        label="가입일:"
        isShow={Boolean(filters.state.startDate && filters.state.endDate)}
      >
        <Chip
          {...chipProps}
          label={fDateRangeShortLabel(filters.state.startDate, filters.state.endDate)}
          onDelete={handleRemoveDate}
        />
      </FiltersBlock>

      <FiltersBlock label="검색어:" isShow={!!filters.state.searchKeyword}>
        <Chip {...chipProps} label={filters.state.searchKeyword} onDelete={handleRemoveKeyword} />
      </FiltersBlock>
    </FiltersResult>
  );
}
