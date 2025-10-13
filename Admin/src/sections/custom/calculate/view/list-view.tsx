import * as XLSX from 'xlsx';

// 타입 정의
import type { IPaymentsItem, ITableFilters } from 'src/types/user';
import { IMetaItem } from 'src/types/meta';

// React Hooks
import { useEffect, useState, useCallback } from 'react';

// Material-UI Components
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';

// 프로젝트 내 경로 및 설정
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

// 커스텀 Hooks 및 스타일
import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';
import { varAlpha } from 'src/theme/styles';


// 레이아웃 및 기본 UI 컴포넌트
import { DashboardContent } from 'src/layouts/dashboard';
import { _rolesType, _rolesMarketing, _searchType, _userList } from 'src/_mock';
import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// 테이블 관련 컴포넌트
import {
	useTable,
	emptyRows,
	rowInPage,
	TableNoData,
	getComparator,
	TableEmptyRows,
	TableHeadCustom,
	TableSelectedAction,
	TablePaginationCustom,
} from 'src/components/table';


// 유틸리티 함수
import { fIsAfter, fIsBetween } from 'src/utils/format-time';


// 서비스 및 API 호출
import PaymentsService from 'src/services/PaymentsService';
import MetaService from 'src/services/MetaService';

// 하위 컴포넌트
import { ListTableRow } from '../list-table-row';
import { ListTableToolbar } from '../list-table-toolbar';
import { ListTableFiltersResult } from '../list-table-filters-result';



// 테이블 헤더 정의
const TABLE_HEAD = [
	{ id: 'student_name', label: '학생명' },
	{ id: 'teacher_name', label: '강사명' },
	{ id: 'class_count', label: '수업회차' },
	{ id: 'class_dates', label: '수업일' },
	{ id: '', width: 88 },
];



export function ListView() {

	const table = useTable();
	const router = useRouter();
	const confirm = useBoolean();


	/*
	| 상태값 초기화
	*/
	// 결제 데이터
	const [tableData, setTableData] = useState<any[]>([]);

	// 구분탭 상태
	const [STATUS_OPTIONS, setSTATUS_OPTIONS] = useState([{ value: 'all', label: '전체' }]);

	// 필터링 상태
	const filters = useSetState<ITableFilters>({ roleKeyword: 'member_name', searchKeyword: '', roleCheck1: [], roleCheck2: [], status: 'all', startDate: null, endDate: null });

	// 날짜 유효성 검사
	const dateError = fIsAfter(filters.state.startDate, filters.state.endDate);

	// 현재 페이지 번호
	const [page, setPage] = useState(1);

	// 검색 필터
	const [instrumentName, setInstrumentName] = useState<string[]>([]);



	// 메타 데이터 로드
	const loadInitialData = useCallback(async () => {



		// 구분탭 설정
		setSTATUS_OPTIONS([
			{ value: 'all', label: '전체' },
		]);
		
	}, []);


	// 검색필터 - 조건 만들기
	const roleCheck1 = [
		'수업전',
		'수업완료',
		'수업불참',
	];
	const roleCheck2 = [
		'',
		'',
	];
	const roleKeyword = [
		'member.teacher_name',
	];



	useEffect(() => {
		loadInitialData();
	}, [loadInitialData]);



	// 결제 리스트 로드
	const loadPaymentsList = useCallback(async () => {
		const data = await PaymentsService.getCalculateAllList(
			filters.state.roleCheck1, // 배열로 전달
			filters.state.startDate?.format('YYYY-MM-DD') || '', 
			filters.state.endDate?.format('YYYY-MM-DD') || '',
			filters.state.roleKeyword, 
			filters.state.searchKeyword
		);
		if (data) {
			setTableData(data);
		}
	}, [filters.state]);




	useEffect(() => {
		loadPaymentsList();
	}, [loadPaymentsList]);


	// 결제 삭제
	const deletePayments = useCallback(async (id: number) => {
		const result = await PaymentsService.delete(id!);
		if (result) {
			loadPaymentsList();
		}
	}, [loadPaymentsList]);

	// 데이터 필터링 처리
	/*
	const dataFiltered = applyFilter({
		inputData: tableData,
		comparator: getComparator(table.order, table.orderBy),
		filters: filters.state,
		dateError,
	});
	*/
	const dataFiltered = tableData;

	// 현재 페이지 데이터 계산
	const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

	// 필터링 초기화 가능 여부
	const canReset =
		!!filters.state.searchKeyword || filters.state.roleCheck1.length > 0 || filters.state.roleCheck2.length > 0 || filters.state.status !== 'all' || Boolean(filters.state.startDate && filters.state.endDate);

	const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

	// 단일 삭제 핸들러
	const handleDeleteRow = useCallback(
		async (id: number) => {
			// const deleteRow = tableData.filter((row) => row.payment_id !== id);
			const deleteRow = tableData.map((row) => row.payment_id === id ? { ...row, status: 40 } : row);

			await deletePayments(id);
			toast.success('삭제가 완료되었습니다.');

			setTableData(deleteRow);

			table.onUpdatePageDeleteRow(dataInPage.length);
		},
		[dataInPage.length, table, tableData, deletePayments]
	);

	// 다중 삭제 핸들러
	const handleDeleteRows = useCallback(async () => {
		// const deleteRows = tableData.filter((row) => !table.selected.includes(row.payment_id!));
		const deleteRows = tableData.map((row) => row.payment_id === Number(table.selected[0]) ? { ...row, status: 40 } : row);

		await Promise.all(table.selected.map((id) => deletePayments(Number(id))));
		toast.success('삭제가 완료되었습니다.');

		setTableData(deleteRows);

		table.onUpdatePageDeleteRows({
			totalRowsInPage: dataInPage.length,
			totalRowsFiltered: dataFiltered.length,
		});
	}, [dataFiltered.length, dataInPage.length, table, tableData, deletePayments]);

	// 단일 수정 핸들러
	const handleEditRow = useCallback(
		(id: number) => {
			router.push(paths.payments.edit(id.toString()));
		},
		[router]
	);

	// 구분탭 변경
	const handleFilterStatus = useCallback(
		(event: React.SyntheticEvent, newValue: string) => {
			table.onResetPage();
			filters.setState({ status: newValue });
		},
		[filters, table]
	);




	const excelDown = async () => {

		 // JSON → Sheet
		const ws = XLSX.utils.json_to_sheet(tableData);

		 // Sheet → Workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

		// 엑셀 파일 다운로드
    XLSX.writeFile(wb, 'payments.xlsx');

	}


	return (
		<>
			<DashboardContent>
				{/* 헤더바 - 브레드크럼, 등록페이지 이동 버튼 */}
				<CustomBreadcrumbs
					heading="강사 정산관리"
					links={[
						{ name: 'Home', href: '/' },
						{ name: '정산관리', href: '/calculate' },
						{ name: '강사 정산조회' },
					]}
					action={
						<>
						<Button
							component={RouterLink}
							variant="contained"
							style={{marginRight : '20px'}}
							onClick={excelDown}
						>
							엑셀다운로드
						</Button>
						
						<Button
							component={RouterLink}
							href={paths.payments.new}
							variant="contained"
							startIcon={<Iconify icon="mingcute:add-line" />}
						>
							결제 등록
						</Button>
						</>
					}
					sx={{ mb: { xs: 3, md: 5 } }}
				/>
				<Card>

					{/* 구분탭 - 결제상태를 구분하는 탭 */}
					{/* <Tabs
						value={filters.state.status}
						onChange={handleFilterStatus}
						sx={{
							px: 2.5,
							boxShadow: (theme) =>
								`inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
						}}
					>
						{STATUS_OPTIONS.map((tab) => (
							<Tab
								key={tab.value}
								iconPosition="end"
								value={tab.value}
								label={
									<span style={{ fontWeight: 'bold' }}>
										{tab.label}
									</span>
								}
								icon={
									<Label
										variant={
											((tab.value === 'all' || tab.value === filters.state.status) && 'filled') ||
											'soft'
										}
										color={
											(tab.value === '20' && 'success') ||
											(tab.value === '10' && 'warning') ||
											'default'
										}
									>
										{['20', '10'].includes(tab.value)
											? tableData.filter((user) => user.status === Number(tab.value)).length
											: tableData.length}
									</Label>
								}
							/>
						))}
					</Tabs> */}

					{/* 상세 검색 */}
					<ListTableToolbar
						filters={filters}
						dateError={dateError}
						onResetPage={table.onResetPage}
						options={{ roleCheck1, roleCheck2, roleKeyword }}
						onLoadList={() => loadPaymentsList()}
					/>

					{/* 필터 초기화 */}
					{canReset && (
						<ListTableFiltersResult
							filters={filters}
							totalResults={dataFiltered.length}
							onResetPage={table.onResetPage}
							sx={{ p: 2.5, pt: 0 }}
						/>
					)}

					<Box sx={{ position: 'relative' }}>
						{/* 일괄삭제 체크박스 */}
						<TableSelectedAction
							dense={table.dense}
							numSelected={table.selected.length}
							rowCount={dataFiltered.length}
							onSelectAllRows={(checked) =>
								table.onSelectAllRows(
									checked,
									dataFiltered.map((row) => row.payment_id!.toString())
								)
							}
							action={
								<Tooltip title="Delete">
									<IconButton color="primary" onClick={confirm.onTrue}>
										<Iconify icon="solar:trash-bin-trash-bold" />
									</IconButton>
								</Tooltip>
							}
						/>

						<Scrollbar>
							<Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
								<TableHeadCustom
									order={table.order}
									orderBy={table.orderBy}
									headLabel={TABLE_HEAD}
									rowCount={dataFiltered.length}
									numSelected={table.selected.length}
									onSort={table.onSort}
									// onSelectAllRows={(checked) =>
									// 	table.onSelectAllRows(
									// 		checked,
									// 		dataFiltered.map((row) => row.payment_id!.toString())
									// 	)
									// }
								/>

								{/* 데이터 리스트 */}
								<TableBody>
									{dataFiltered
										.slice(
											table.page * table.rowsPerPage,
											table.page * table.rowsPerPage + table.rowsPerPage
										)
										.map((row) => (
											<ListTableRow
												key={row.payment_id}
												row={row}
												selected={table.selected.includes(row.payment_id!.toString())}
												statusOptions={STATUS_OPTIONS}
												onSelectRow={() => table.onSelectRow(row.payment_id!.toString())}
												onDeleteRow={() => handleDeleteRow(row.payment_id!)}
												onEditRow={() => handleEditRow(row.payment_id!)}
											/>
										))}

									<TableEmptyRows
										height={table.dense ? 56 : 56 + 20}
										emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
									/>

									<TableNoData notFound={notFound} />
								</TableBody>
							</Table>
						</Scrollbar>
					</Box>

					{/* 페이지 네이션 */}
					<TablePaginationCustom
						page={table.page}
						dense={table.dense}
						count={dataFiltered.length}
						rowsPerPage={table.rowsPerPage}
						onPageChange={table.onChangePage}
						onChangeDense={undefined /* table.onChangeDense */}
						onRowsPerPageChange={table.onChangeRowsPerPage}
					/>
				</Card>
			</DashboardContent>

			{/* 일괄 삭제 */}
			<ConfirmDialog
				open={confirm.value}
				onClose={confirm.onFalse}
				title="삭제"
				content={
					<>
						<strong>{table.selected.length}</strong>개의 결제을 정말 삭제 하시겠습니까?
					</>
				}
				action={
					<Button
						variant="contained"
						color="error"
						onClick={() => {
							handleDeleteRows();
							confirm.onFalse();
						}}
					>
						삭제
					</Button>
				}
			/>
		</>
	);
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
	dateError: boolean;
	inputData: any[];
	filters: ITableFilters;
	comparator: (a: any, b: any) => number;
};

// 필터링 함수
function applyFilter({ inputData, comparator, filters, dateError }: ApplyFilterProps) {
	const { searchKeyword, status, roleCheck1, roleCheck2, roleKeyword, startDate, endDate } = filters;

	const stabilizedThis = inputData.map((el, index) => [el, index] as const);

	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});

	inputData = stabilizedThis.map((el) => el[0]);



	// 구분탭
	if (status !== 'all') {
		inputData = inputData.filter((row) => row.status === Number(status));
	}

	// checkbox1
	if (roleCheck1.length) {
		inputData = inputData.filter((row) => roleCheck1.includes(row.instrument_option === 10 ? '악기대여' : row.instrument_option === 20 ? '개인악기사용' : '악기구입'));
	}

	// checkbox2
	if (roleCheck2.length) {
		inputData = inputData.filter((row) => roleCheck2.includes(row.periodic_payment === 10 ? '일반결제' : '정기결제'));
	}

	// 기간 검색
	if (!dateError) {
		if (startDate && endDate) {
			inputData = inputData.filter((row) => fIsBetween(row.payment_date, startDate, endDate));
		}
	}

	// 키워드 검색
	if (searchKeyword) {
		if (roleKeyword === 'teacher_name') {
			inputData = inputData.filter(
				(row) => (row.teacher_name ?? '').toLowerCase().indexOf(searchKeyword.toLowerCase()) !== -1
			);
		} else if (roleKeyword === 'member.name') {
			inputData = inputData.filter(
				(row) => (row.member?.name ?? '').toLowerCase().indexOf(searchKeyword.toLowerCase()) !== -1
			);
		} else if (roleKeyword === 'instrument.name') {
			inputData = inputData.filter(
				(row) => (row.instrument?.name ?? '').toLowerCase().indexOf(searchKeyword.toLowerCase()) !== -1
			);
		} else if (roleKeyword === 'teacher.name') {
			inputData = inputData.filter(
				(row) => (row.teacher?.name ?? '').toLowerCase().indexOf(searchKeyword.toLowerCase()) !== -1
			);
		}
	}
	return inputData;
}
