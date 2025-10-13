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

				<TableCell sx={{ width: '150px', textAlign: 'center', whiteSpace: 'nowrap' }}>
					{row.teacher_name}
				</TableCell>

				<TableCell sx={{ width: '200px', textAlign: 'center', whiteSpace: 'nowrap' }}>
					{row.student_name}
				</TableCell>

				<TableCell sx={{ width: '150px', textAlign: 'center', whiteSpace: 'nowrap' }}>
					{row.sender_name}
				</TableCell>

				<TableCell sx={{ wordWrap:'break-word', hiteSpace: 'nowrap' }}>
					{row.content}
				</TableCell>

				<TableCell sx={{ whiteSpace: 'nowrap' }}>
					{(() => {
						const date = new Date(row.created_date);
						const yyyy = date.getFullYear();
						const mm = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작
						const dd = String(date.getDate()).padStart(2, '0');
						const hh = String(date.getHours()).padStart(2, '0');
						const mi = String(date.getMinutes()).padStart(2, '0');
						const ss = String(date.getSeconds()).padStart(2, '0');
						return `${yyyy}.${mm}.${dd}. ${hh}:${mi}:${ss} `;
					})()}
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
