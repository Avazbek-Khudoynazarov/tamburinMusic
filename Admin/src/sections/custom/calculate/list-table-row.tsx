import type { IPaymentsItem } from 'src/types/user';
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

import { useBoolean } from 'src/hooks/use-boolean';

import dayjs from 'dayjs';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { IMetaItem } from 'src/types/meta';


// ----------------------------------------------------------------------

type Props = {
	row: any;
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

				<TableCell sx={{ width:'200px', textAlign: 'center', whiteSpace: 'nowrap' }}>
						{row.student_name}
				</TableCell>

				<TableCell sx={{ width:'150px', textAlign: 'center', whiteSpace: 'nowrap' }}>
						{row.teacher_name}
				</TableCell>

				<TableCell sx={{ whiteSpace: 'nowrap' }}>
						{row.class_count}
				</TableCell>

				<TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'left' }}>
						{row.class_dates}
				</TableCell>



				{/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{new Date(row.created_date).toISOString().split('T')[0]}</TableCell> */}


			</TableRow>


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
