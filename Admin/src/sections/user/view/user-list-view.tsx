import type { IUserItem, IUserTableFilters } from 'src/types/user';

import { useEffect, useState, useCallback } from 'react';
import { set } from 'nprogress';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';
import { _rolesType, _rolesMarketing, _searchType, _userList } from 'src/_mock';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
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

import { fIsAfter, fIsBetween } from 'src/utils/format-time';

import { IMetaItem } from 'src/types/meta';

import MemberService from 'src/services/MemberService';
import MetaService from 'src/services/MetaService';

import { UserTableRow } from '../user-table-row';
import { UserTableToolbar } from '../user-table-toolbar';
import { UserTableFiltersResult } from '../user-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: '이름' },
  { id: 'cellphone', label: '전화번호', width: 180 },
  { id: 'school_name', label: '학교명', width: 220 },
  { id: 'type', label: '회원구분', width: 180 },
  { id: 'status', label: '상태', width: 100 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function UserListView() {
  const table = useTable();

  const router = useRouter();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState<IUserItem[]>([]);
  const [memberStatusMetaList, setMemberStatusMetaList] = useState<IMetaItem[]>([]);
  const filters = useSetState<IUserTableFilters>({ searchType: 'id', searchKeyword: '', roleType: [], roleMarketing: [], status: 'all', startDate: null, endDate: null });

  const dateError = fIsAfter(filters.state.startDate, filters.state.endDate);

  const [page, setPage] = useState(1);
  const [STATUS_OPTIONS, setSTATUS_OPTIONS] = useState([{ value: 'all', label: '전체' }]);

  const loadMemberList = useCallback(async (loadPage: number) => {
    const metaList = await MetaService.getList('memberstatus');
    setSTATUS_OPTIONS([...STATUS_OPTIONS, ...metaList.map((e: IMetaItem) => ({ value: e.entity_id, label: e.entity_value }))]);
    MemberService.getList(loadPage).then((data) => {
      if(data) {
        setTableData(data);
      }
    });
  }, [STATUS_OPTIONS]);

  // useEffect(() => {
  //   loadMemberList(1);
  // }, []);

  const deleteMember = useCallback(async (id: number) => {
    const result = await MemberService.delete(id!);
    if (result) {
      loadMemberList(page);
    }
  }, [page, loadMemberList]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
    dateError,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!filters.state.searchKeyword || filters.state.roleType.length > 0 || filters.state.roleMarketing.length > 0 || filters.state.status !== 'all' || Boolean(filters.state.startDate && filters.state.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleDeleteRow = useCallback(
    async (id: number) => {
      // const deleteRow = tableData.filter((row) => row.id !== id);
      const deleteRow = tableData.map((row) => row.id === id ? { ...row, status: 40 } : row);

      await deleteMember(id);
      toast.success('삭제가 완료되었습니다.');

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData, deleteMember]
  );

  const handleDeleteRows = useCallback(async () => {
    // const deleteRows = tableData.filter((row) => !table.selected.includes(row.id!));
    const deleteRows = tableData.map((row) => row.id === Number(table.selected[0]) ? { ...row, status: 40 } : row);

    await Promise.all(table.selected.map((id) => deleteMember(Number(id))));
    toast.success('삭제가 완료되었습니다.');

    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData, deleteMember]);

  const handleEditRow = useCallback(
    (id: number) => {
      router.push(paths.member.edit(id.toString()));
    },
    [router]
  );

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
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.member.root },
            { name: 'User', href: paths.member.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.member.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              신규 회원
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Card>
        <Tabs
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
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.state.status) && 'filled') ||
                      'soft'
                    }
                    color={
                      (tab.value === '20' && 'success') ||
                      (tab.value === '40' && 'error') ||
                      'default'
                    }
                  >
                    {['20', '40'].includes(tab.value)
                      ? tableData.filter((user) => user.status === Number(tab.value)).length
                      : tableData.length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <UserTableToolbar
            filters={filters}
            dateError={dateError}
            onResetPage={table.onResetPage}
            options={{ rolesType: _rolesType, rolesMarketing: _rolesMarketing, searchType: _searchType }}
          />

          {canReset && (
            <UserTableFiltersResult
              filters={filters}
              totalResults={dataFiltered.length}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: 'relative' }}>
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

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <UserTableRow
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

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="삭제"
        content={
          <>
            <strong>{table.selected.length}</strong>개의 데이터를 정말 삭제하시겠습니까?
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
  inputData: IUserItem[];
  filters: IUserTableFilters;
  comparator: (a: any, b: any) => number;
};

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
    inputData = inputData.filter((user) => roleType.includes(user.type === 10 ? '회원' : '강사'));
  }

  if (roleMarketing.length) {
    inputData = inputData.filter((user) => roleMarketing.includes(user.agree_marketing === 'true' ? '동의' : '미동의'));
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((user) => fIsBetween(user.created_date, startDate, endDate));
    }
  }

  return inputData;
}
