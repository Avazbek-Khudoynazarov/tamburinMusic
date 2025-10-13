import type { ITableFilters } from '@/components/UI/Minimal/types/user';
import type { SelectChangeEvent } from '@mui/material/Select';
import type { UseSetStateReturn } from '@/components/UI/Minimal/hooks//use-set-state';

import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { formHelperTextClasses } from '@mui/material/FormHelperText';

import { Iconify } from '@/components/UI/Minimal/components/iconify';
import { usePopover, CustomPopover } from '@/components/UI/Minimal/components/custom-popover';
import type { IDatePickerControl } from '@/components/UI/Minimal/types/common';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/ko';

// ----------------------------------------------------------------------

type Props = {
	dateError: boolean;
	onResetPage: () => void;
	filters: UseSetStateReturn<ITableFilters>;
	options: {
		roleCheck1: string[];
		roleCheck2: string[];
		roleKeyword: string[];
	};
};

export function ListTableToolbar({ filters, options, onResetPage, dateError }: Props) {
	const popover = usePopover();

	

	// 체크박스
	const handleFilterCheck1 = useCallback(
		(event: SelectChangeEvent<string[]>) => {
			const newValue =
				typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value;

			onResetPage();
			filters.setState({ roleCheck1: newValue });
		},
		[filters, onResetPage]
	);

	const handleFilterCheck2 = useCallback(
		(event: SelectChangeEvent<string[]>) => {
			const newValue =
				typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value;

			onResetPage();
			filters.setState({ roleCheck2: newValue });
		},
		[filters, onResetPage]
	);

	// 기간 검색
	const handleFilterStartDate = useCallback(
		(newValue: IDatePickerControl) => {
			onResetPage();
			filters.setState({ startDate: newValue });
		},
		[filters, onResetPage]
	);

	const handleFilterEndDate = useCallback(
		(newValue: IDatePickerControl) => {
			onResetPage();
			filters.setState({ endDate: newValue });
		},
		[filters, onResetPage]
	);

	// 키워드 검색
	const handleFilterSearchKeyword = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			onResetPage();
			filters.setState({ searchKeyword: event.target.value });
		},
		[filters, onResetPage]
	);

	return (
		<>
			<Stack
				spacing={2}
				alignItems={{ xs: 'flex-end', md: 'center' }}
				direction={{ xs: 'column', md: 'row' }}
				sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
			>

				<FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
					<InputLabel htmlFor="user-filter-role-select-label">악기 결제옵션</InputLabel>
					<Select
						multiple
						value={filters.state.roleCheck1}
						onChange={handleFilterCheck1}
						input={<OutlinedInput label="roleCheck1" />}
						renderValue={(selected) => selected.map((value: string) => value).join(', ')}
						inputProps={{ id: 'user-filter-role-select-label' }}
						MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
					>
						{options.roleCheck1.map((option) => (
							<MenuItem key={option} value={option}>
								<Checkbox
									disableRipple
									size="small"
									checked={filters.state.roleCheck1.includes(option)}
								/>
								{option}
							</MenuItem>
						))}
					</Select>
				</FormControl>

        {/* <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
          <InputLabel htmlFor="user-filter-role-select-label">정기 결제여부</InputLabel>
          <Select
            multiple
            value={filters.state.roleCheck2}
            onChange={handleFilterCheck2}
            input={<OutlinedInput label="roleCheck2" />}
            renderValue={(selected) => selected.map((value: string) => value).join(', ')}
            inputProps={{ id: 'user-filter-role-select-label' }}
            MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
          >
            {options.roleCheck2.map((option) => (
              <MenuItem key={option} value={option}>
                <Checkbox
                  disableRipple
                  size="small"
                  checked={filters.state.roleCheck2.includes(option)}
                />
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl> */}

				<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='ko'>
					<DatePicker
						label="시작일"
						value={filters.state.startDate}
						onChange={handleFilterStartDate}
						slotProps={{ textField: { fullWidth: true } }}
						sx={{ maxWidth: { md: 200 } }}
						localeText={{
							month: '월',
							year: '년',
							day: '일'
						}}
					/>
				</LocalizationProvider>

				<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='ko'>
					<DatePicker
						label="종료일"
						value={filters.state.endDate}
						onChange={handleFilterEndDate}
						slotProps={{
							textField: {
								fullWidth: true,
								error: dateError,
								helperText: dateError ? 'End date must be later than start date' : null,
							},
						}}
						sx={{
							maxWidth: { md: 200 },
							[`& .${formHelperTextClasses.root}`]: {
								position: { md: 'absolute' },
								bottom: { md: -40 },
							},
						}}
					/>
				</LocalizationProvider>

				<FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
					<InputLabel htmlFor="user-filter-role-select-label">검색 필터</InputLabel>
					<Select
						value={filters.state.roleKeyword}
						onChange={(e) => filters.setState({ roleKeyword: e.target.value })}
						input={<OutlinedInput label="검색 필터" />}
						inputProps={{ id: 'user-filter-role-select-label' }}
						MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
					>
						{options.roleKeyword.map((option) => (
							<MenuItem key={option} value={option}>
								{option === 'member.user_id' ? '아이디' : option === 'member.name' ? '회원명' : option === 'instrument.name' ? '악기명' : '선생님'}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
					<TextField
						fullWidth
						value={filters.state.searchKeyword}
						onChange={handleFilterSearchKeyword}
						placeholder="Search..."
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
								</InputAdornment>
							),
						}}
					/>

					{/*
          <IconButton onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
          */}
				</Stack>
			</Stack>

			<CustomPopover
				open={popover.open}
				anchorEl={popover.anchorEl}
				onClose={popover.onClose}
				slotProps={{ arrow: { placement: 'right-top' } }}
			>
				<MenuList>
					<MenuItem
						onClick={() => {
							popover.onClose();
						}}
					>
						<Iconify icon="solar:printer-minimalistic-bold" />
						Print
					</MenuItem>

					<MenuItem
						onClick={() => {
							popover.onClose();
						}}
					>
						<Iconify icon="solar:import-bold" />
						Import
					</MenuItem>

					<MenuItem
						onClick={() => {
							popover.onClose();
						}}
					>
						<Iconify icon="solar:export-bold" />
						Export
					</MenuItem>
				</MenuList>
			</CustomPopover>
		</>
	);
}
