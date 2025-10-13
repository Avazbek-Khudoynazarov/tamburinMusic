// 타입 정의
import type { IMemberItem, IUserTableFilters } from 'src/types/user';
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
import MemberService from 'src/services/MemberService';
import MetaService from 'src/services/MetaService';

// 하위 컴포넌트
import { ListTableRow } from '../list-table-row';
import { ListTableToolbar } from '../list-table-toolbar';
import { ListTableFiltersResult } from '../list-table-filters-result';



// 테이블 헤더 정의
const TABLE_HEAD = [
  { id: 'name', label: '강사 정보' },
  { id: 'cellphone', label: '연락처' },
  { id: 'last_login', label: '최근 접속일' },
  { id: 'created_date', label: '가입일' },
  { id: 'status', label: '강사 상태', width: 120 },
  { id: '', width: 88 },
];


export function ListView() {
  
	const table = useTable();
  const router = useRouter();
  const confirm = useBoolean();

	
	/*
	| 상태값 초기화
	*/
	// 강사 데이터
  const [tableData, setTableData] = useState<IMemberItem[]>([]);

	// 구분탭 상태
  const [STATUS_OPTIONS, setSTATUS_OPTIONS] = useState([{ value: 'all', label: '전체' }]);

	// 필터링 상태
  const filters = useSetState<IUserTableFilters>({ searchType: 'id', searchKeyword: '', roleType: [], roleMarketing: [], status: 'all', startDate: null, endDate: null });

	// 날짜 유효성 검사
  const dateError = fIsAfter(filters.state.startDate, filters.state.endDate);
	
	// 현재 페이지 번호
  const [page, setPage] = useState(1);

	
	// 메타 데이터 로드
const loadMetaData = useCallback(async () => {
  // 구분탭 데이터 로드
  const metaList = await MetaService.getList('memberStatus');
  setSTATUS_OPTIONS([
    { value: 'all', label: '전체' },
    ...metaList.map((e: IMetaItem) => ({
      value: e.entity_id,
      label: e.entity_value,
    })),
  ]);
}, []);


// 강사 리스트 로드
const loadMemberList = useCallback(async () => {
  const data = await MemberService.getAllTypeList("20");
  if (data) {
    setTableData(data);
  }
}, []);


 // 초기 데이터 로드
 useEffect(() => {
	loadMetaData();
}, [loadMetaData]);


useEffect(() => {
	loadMemberList();
}, [loadMemberList]);


	// 강사 삭제
  const deleteMember = useCallback(async (id: number) => {
    const result = await MemberService.delete(id!);
    if (result) {
      loadMemberList();
    }
  }, [loadMemberList]);

	// 데이터 필터링 처리
  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
    dateError,
  });

	 // 현재 페이지 데이터 계산
  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

	// 필터링 초기화 가능 여부
  const canReset =
    !!filters.state.searchKeyword || filters.state.roleType.length > 0 || filters.state.roleMarketing.length > 0 || filters.state.status !== 'all' || Boolean(filters.state.startDate && filters.state.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

	// 단일 삭제 핸들러
  const handleDeleteRow = useCallback(
    async (id: number) => {
      // const deleteRow = tableData.filter((row) => row.id !== id);
      const deleteRow = tableData.map((row) => row.id === id ? { ...row, status: 40 } : row);

      await deleteMember(id);
      toast.success('탈퇴가 완료되었습니다.');

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData, deleteMember]
  );

	// 다중 삭제 핸들러
  const handleDeleteRows = useCallback(async () => {
    // const deleteRows = tableData.filter((row) => !table.selected.includes(row.id!));
    const deleteRows = tableData.map((row) => row.id === Number(table.selected[0]) ? { ...row, status: 40 } : row);

    await Promise.all(table.selected.map((id) => deleteMember(Number(id))));
    toast.success('탈퇴가 완료되었습니다.');

    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData, deleteMember]);

	// 단일 수정 핸들러
  const handleEditRow = useCallback(
    (id: number) => {
      router.push(paths.teacher.edit(id.toString()));
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

	
  return (
    <>
      <DashboardContent>
				{/* 헤더바 - 브레드크럼, 등록페이지 이동 버튼 */}
        <CustomBreadcrumbs
          heading="강사 조회"
          links={[
						{ name: 'Home', href: '/' },
						{ name: '강사관리', href: '/teacher/list' },
						{ name: '강사조회' },
					]}
          action={
            <Button
              component={RouterLink}
              href={paths.teacher.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              강사 등록
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Card>


          <Box sx={{ position: 'relative' }}>
					{/* 일괄삭제 체크박스 */}
          <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id!.toString())
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
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => row.id!.toString())
                    )
                  }
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
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id!.toString())}
                        statusOptions={STATUS_OPTIONS}
                        onSelectRow={() => table.onSelectRow(row.id!.toString())}
                        onDeleteRow={() => handleDeleteRow(row.id!)}
                        onEditRow={() => handleEditRow(row.id!)}
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
            onChangeDense={undefined /* table.onChangeDense */ }
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      </DashboardContent>

			{/* 일괄 삭제 */}
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="탈퇴"
        content={
          <>
            <strong>{table.selected.length}</strong>명의 강사을 정말 탈퇴처리 하시겠습니까?
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
            탈퇴
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  dateError: boolean;
  inputData: IMemberItem[];
  filters: IUserTableFilters;
  comparator: (a: any, b: any) => number;
};

// 필터링 함수
function applyFilter({ inputData, comparator, filters, dateError }: ApplyFilterProps) {
  const { searchType,searchKeyword, status, roleType, roleMarketing, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (searchKeyword) {
    if(searchType === 'id') {
      inputData = inputData.filter(
        (user) => user.user_id.toLowerCase().indexOf(searchKeyword.toLowerCase()) !== -1
      );
    } else if(searchType === 'name') {
      inputData = inputData.filter(
        (user) => user.name.toLowerCase().indexOf(searchKeyword.toLowerCase()) !== -1
      );
    } else if(searchType === 'cellphone') {
      inputData = inputData.filter(
        (user) => user.cellphone.toLowerCase().indexOf(searchKeyword.toLowerCase()) !== -1
      );
    }
  }

  if (status !== 'all') {
    inputData = inputData.filter((user) => user.status === Number(status));
  }

  if (roleType.length) {
    inputData = inputData.filter((user) => roleType.includes(user.type === 10 ? '강사' : '강사'));
  }

  if (roleMarketing.length) {
    inputData = inputData.filter((user) => roleMarketing.includes(user.agree_marketing === '동의' ? '동의' : '미동의'));
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((user) => fIsBetween(user.created_date, startDate, endDate));
    }
  }

  return inputData;
}
