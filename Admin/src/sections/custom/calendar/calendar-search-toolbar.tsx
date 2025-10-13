import type { ITableFilters } from 'src/types/user';
import type { SelectChangeEvent } from '@mui/material/Select';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';

import { useCallback, useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

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
	searchValue: string;
	onSearchChange: (value: string) => void;
};

export function CalendarSearchToolbar({ 
	filters, 
	options, 
	onResetPage, 
	dateError, 
	searchValue, 
	onSearchChange 
}: Props) {
	const popover = usePopover();
	
	// 검색어 입력 처리
	const handleSearchInputChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			onSearchChange(event.target.value);
		},
		[onSearchChange]
	);
	
	// 디바운스 적용하여 필터 상태 업데이트
	useEffect(() => {
		const timer = setTimeout(() => {
			onResetPage();
			filters.setState({ searchKeyword: searchValue });
		}, 500); // 500ms 후에 상태 업데이트
		
		return () => {
			clearTimeout(timer); // 타이머 클리어
		};
	}, [searchValue, filters, onResetPage]);

	return (
		<>
			<Stack
				spacing={2}
				alignItems={{ xs: 'flex-end', md: 'center' }}
				direction={{ xs: 'column', md: 'row' }}
				sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
			>
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
						value={searchValue}
						onChange={handleSearchInputChange}
						placeholder="Search..."
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
								</InputAdornment>
							),
						}}
					/>
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
				</MenuList>
			</CustomPopover>
		</>
	);
} 