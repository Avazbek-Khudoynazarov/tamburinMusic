import type { IMemberItem } from 'src/types/user';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { IMetaItem } from 'src/types/meta';


// ----------------------------------------------------------------------

type Props = {
	row: IMemberItem;
	selected: boolean;
	statusOptions: { value: string, label: string }[];
	onEditRow: () => void;
	onSelectRow: () => void;
	onDeleteRow: () => void;
};

export function ListTableRow({ row, selected, statusOptions, onEditRow, onSelectRow, onDeleteRow }: Props) {
	const confirm = useBoolean();

	const popover = usePopover();

	const quickEdit = useBoolean();

	return (
		<>
			<TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
				<TableCell padding="checkbox">
					<Checkbox id={row.id!.toString()} checked={selected} onClick={onSelectRow} />
				</TableCell>

				<TableCell>
					<Stack spacing={2} direction="row" alignItems="center">
						<Avatar alt={row.image_file} src={row.image_file} />

						<Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
							<Link color="inherit" onClick={onEditRow} sx={{ cursor: 'pointer' }}>
								{row.name}
							</Link>
							<Box component="span" sx={{ color: 'text.disabled' }}>
								{row.user_id}
							</Box>
						</Stack>
					</Stack>
				</TableCell>

				<TableCell sx={{ whiteSpace: 'nowrap' }}>
					<Link color="inherit" onClick={onEditRow} sx={{ cursor: 'pointer' }}>
						{row.cellphone}
					</Link>
				</TableCell>

				<TableCell sx={{ whiteSpace: 'nowrap' }}>{row.total_payments}</TableCell>

				<TableCell sx={{ whiteSpace: 'nowrap' }}>{row.total_price ? row.total_price.toLocaleString() : 0}</TableCell>

				<TableCell sx={{ whiteSpace: 'nowrap' }}>{row.remaining_classes}</TableCell>




				{/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.gender}</TableCell> */}
				{/* 
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.school_name}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.grade}</TableCell> */}
				{/* 
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.parent_name}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.parent_cellphone}</TableCell> */}

		


				<TableCell sx={{ whiteSpace: 'nowrap' }}>{row.last_login && new Date(row.last_login).toISOString().split('T')[0]}</TableCell>


				<TableCell sx={{ whiteSpace: 'nowrap' }}>{new Date(row.created_date).toISOString().split('T')[0]}</TableCell>

				<TableCell>
					<Label
						variant="soft"
						color={
							(row.status === 20 && 'success') ||
							(row.status === 40 && 'error') ||
							'default'
						}
					>
						{statusOptions.find((option) => option.value === row.status.toString())?.label}
					</Label>
				</TableCell>


				<TableCell>
					<Stack direction="row" alignItems="center">
						{/*
            <Tooltip title="Quick Edit" placement="top" arrow>
              <IconButton
                color={quickEdit.value ? 'inherit' : 'default'}
                onClick={quickEdit.onTrue}
              >
                <Iconify icon="solar:pen-bold" />
              </IconButton>
            </Tooltip>
            */}

						<IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
							<Iconify icon="eva:more-vertical-fill" />
						</IconButton>
					</Stack>
				</TableCell>
			</TableRow>

			<CustomPopover
				open={popover.open}
				anchorEl={popover.anchorEl}
				onClose={popover.onClose}
				slotProps={{ arrow: { placement: 'right-top' } }}
			>
				<MenuList>

					<MenuItem
						onClick={() => {
							onEditRow();
							popover.onClose();
						}}
					>
						<Iconify icon="solar:pen-bold" />
						수정
					</MenuItem>


					<MenuItem
						onClick={() => {
							confirm.onTrue();
							popover.onClose();
						}}
						sx={{ color: 'error.main' }}
					>
						<Iconify icon="solar:trash-bin-trash-bold" />
						탈퇴
					</MenuItem>
				</MenuList>
			</CustomPopover>

			<ConfirmDialog
				open={confirm.value}
				onClose={confirm.onFalse}
				title="탈퇴"
				content="정말 탈퇴처리 하시겠습니까?"
				action={
					<Button variant="contained" color="error" onClick={() => { onDeleteRow(); confirm.onFalse(); }}>
						탈퇴
					</Button>
				}
			/>
		</>
	);
}
