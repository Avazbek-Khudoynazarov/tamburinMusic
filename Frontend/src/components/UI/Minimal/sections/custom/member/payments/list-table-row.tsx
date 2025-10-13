import type { IPaymentsItem } from '@/components/UI/Minimal/types/user';
import { Link } from 'react-router-dom';


import Box from '@mui/material/Box';
// import Link from '@mui/material/Link';
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

import { useBoolean } from '@/components/UI/Minimal/hooks//use-boolean';

import dayjs from 'dayjs';

import { Label } from '@/components/UI/Minimal/components/label';
import { Iconify } from '@/components/UI/Minimal/components/iconify';
import { ConfirmDialog } from '@/components/UI/Minimal/components/custom-dialog';
import { usePopover, CustomPopover } from '@/components/UI/Minimal/components/custom-popover';
import { IMetaItem } from '@/components/UI/Minimal/types/meta';


// ----------------------------------------------------------------------

type Props = {
	row: IPaymentsItem;
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

				<TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'left' }}>
					<Link to={`/payments/${row.id}/edit`} style={{ color: 'inherit', textDecoration: 'none' }}>
						<strong>[수업명] </strong>{row.instrument?.name} &nbsp; &nbsp;<strong>[커리큘럼] </strong>{row.curriculum?.name}<br />
						<strong>[악기옵션] </strong>{row.instrument_option === 10 ? '악기대여' : row.instrument_option === 20 ? '악기대여안함' : '악기구입'}
					</Link>
				</TableCell>

				
				<TableCell sx={{ whiteSpace: 'nowrap' }}>
					<Link to={`/teacher/${row.member?.id}/edit`} style={{ color: 'inherit', textDecoration: 'none' }}>
						{row.teacher?.name ? row.teacher?.name : '미선택'}
					</Link>
				</TableCell>



				<TableCell sx={{ whiteSpace: 'nowrap' }}>
					<Link to={`/payments/${row.id}/edit`} style={{ color: 'inherit', textDecoration: 'none' }}>
					{ row.remaining_classes } / { row.total_classes }
					</Link>
				</TableCell>


				<TableCell sx={{ whiteSpace: 'nowrap' }}>
					<Link to={`/payments/${row.id}/edit`} style={{ color: 'inherit', textDecoration: 'none' }}>
						{row.periodic_payment === 10 ? '일반결제' : '정기결제'}
					</Link>
				</TableCell>



				<TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
					<Link to={`/payments/${row.id}/edit`} style={{ color: 'inherit', textDecoration: 'none' }}>
						{row.payment_method === 'card' ? '신용카드' : row.payment_method === 'trans' ? '실시간 계좌이체' : row.payment_method === 'vbank' ? '가상계좌' : '무통장입금'}
					</Link>
				</TableCell>

				<TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{row.final_price.toLocaleString()} 원</TableCell>

				<TableCell sx={{ whiteSpace: 'nowrap' }}>
					{row.payment_date ? dayjs(row.payment_date).format('YYYY-MM-DD HH:mm') : dayjs(row.created_date).format('YYYY-MM-DD HH:mm')}
				</TableCell>


				<TableCell>
					<Label
						variant="soft"
						color={
							(row.status === 20 && 'success') ||
							(row.status === 10 && 'warning') ||
							'default'
						}
					>
						{statusOptions.find((option) => option.value === row.status.toString())?.label}
					</Label>
				</TableCell>




				{/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{new Date(row.created_date).toISOString().split('T')[0]}</TableCell> */}


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
