import type { IPopupItem } from 'src/types/user';

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

import dayjs from 'dayjs';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { IMetaItem } from 'src/types/meta';


// ----------------------------------------------------------------------

type Props = {
	row: IPopupItem;
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


				<TableCell sx={{ whiteSpace: 'nowrap' }}>
					<Link color="inherit" onClick={onEditRow} sx={{ cursor: 'pointer' }}>
						{row.name}
					</Link>
				</TableCell>

				<TableCell sx={{ whiteSpace: 'nowrap' }}>{row.start_date ? new Date(row.start_date).toLocaleDateString() : '-'}</TableCell>

				
				<TableCell sx={{ whiteSpace: 'nowrap' }}>{row.end_date ? new Date(row.end_date).toLocaleDateString() : '-'}</TableCell>


				<TableCell sx={{ whiteSpace: 'nowrap' }}>{new Date(row.created_date).toISOString().split('T')[0]}</TableCell>

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
						삭제
					</MenuItem>
				</MenuList>
			</CustomPopover>

			<ConfirmDialog
				open={confirm.value}
				onClose={confirm.onFalse}
				title="삭제"
				content="정말 삭제 하시겠습니까?"
				action={
					<Button variant="contained" color="error" onClick={() => { onDeleteRow(); confirm.onFalse(); }}>
						삭제
					</Button>
				}
			/>
		</>
	);
}
