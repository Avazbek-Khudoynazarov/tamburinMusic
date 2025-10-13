import Calendar from '@fullcalendar/react'; // => request placed at the top
import type { ICalendarEvent, ICalendarFilters } from 'src/types/calendar';
import type { ITableFilters } from 'src/types/user'; // 추가
import dayjs from 'dayjs';

import { useEffect, useState, useCallback, useRef } from 'react';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import interactionPlugin from '@fullcalendar/interaction';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box'; // 추가

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { fDate, fIsAfter, fIsBetween } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';
import { CALENDAR_COLOR_OPTIONS } from 'src/_mock/_calendar';
import { updateEvent, useGetEvents } from 'src/actions/calendar';

import { Iconify } from 'src/components/iconify';
import { paths } from 'src/routes/paths';

import { IClassesItem } from 'src/types/user';
import ClassesService from 'src/services/ClassesService';

import { StyledCalendar } from '../styles';
import { useEvent } from '../hooks/use-event';
import { CalendarForm } from '../calendar-form';
import { useCalendar } from '../hooks/use-calendar';
import { CalendarToolbar } from '../calendar-toolbar';
import { CalendarFilters } from '../calendar-filters';

// 검색 필터 컴포넌트 추가
import { CalendarSearchToolbar } from '../calendar-search-toolbar';
import { ListTableFiltersResult } from '../../payments/list-table-filters-result';

// ----------------------------------------------------------------------

export function CalendarView() {
  const [events, setEvents] = useState<ICalendarEvent[]>([]);
  const theme = useTheme();
  
  // 현재 캘린더에 표시된 날짜 범위 추적
  const [visibleDateRange, setVisibleDateRange] = useState<{start: string, end: string} | null>(null);

  const openFilters = useBoolean();

  // const { events, eventsLoading } = useGetEvents();
  /* 
  const events: ICalendarEvent[] = [
    {
      id: '1',
      title: '테스트',
      start: dayjs(new Date()).add(1, 'day').format(),
      end: dayjs(new Date()).add(1, 'day').format(),
      color: CALENDAR_COLOR_OPTIONS[0],
      allDay: true,
      description: '설명',
    },
  ];
  */
  const eventsLoading = false;

  const filters = useSetState<ICalendarFilters>({
    colors: [],
    startDate: null,
    endDate: null,
  });

  // 검색 필터링을 위한 상태 추가
  const tableFilters = useSetState<ITableFilters>({ 
    roleKeyword: 'member.name', 
    searchKeyword: '', 
    roleCheck1: [], 
    roleCheck2: [], 
    status: 'all', 
    startDate: null, 
    endDate: null 
  });

  const dateError = fIsAfter(filters.state.startDate, filters.state.endDate);
  const tableFilterDateError = fIsAfter(tableFilters.state.startDate, tableFilters.state.endDate);

  const {
    calendarRef,
    //
    view,
    date,
    //
    onDatePrev,
    onDateNext,
    onDateToday,
    onDropEvent,
    onChangeView,
    onSelectRange,
    onClickEvent,
    onResizeEvent,
    onInitialView,
    //
    openForm,
    onOpenForm,
    onCloseForm,
    //
    selectEventId,
    selectedRange,
    //
    onClickEventInFilters,
  } = useCalendar();

  const currentEvent = useEvent(events, selectEventId, selectedRange, openForm);

  // 현재 표시된 이벤트 개수
  const [visibleEventCount, setVisibleEventCount] = useState(0);

  // 검색어 관리를 위한 상태 추가
  const [searchValue, setSearchValue] = useState('');

  // 검색어 변경 핸들러
  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  // 필터 초기화 핸들러
  const handleResetFilters = useCallback(() => {
    setSearchValue('');
    tableFilters.setState({
      ...tableFilters.state,
      searchKeyword: '',
      roleCheck1: []
    });
  }, [tableFilters]);

  const loadClasses = useCallback(() => {
    ClassesService.getAllList().then((data) => {
      if(data) {
        const newEvents = data.map((item: IClassesItem) => ({
          id: item.id?.toString(),
          member_id: item.member_id,
          status: item.status,
          title: `${item.member?.name} ${item.instrument?.name} / ${item.curriculum?.name}`,
          start: dayjs(item.classes_date).format(),
          end: dayjs(item.classes_date).add(1, "minute").format(),
          textColor: item.status === 10 ? "#a3a3a3" : item.status === 20 ? "#000000" : "#f44336",
          url: paths.payments.edit(item.payments_id.toString(), item.id?.toString()),
          // 검색 필터링을 위한 추가 데이터
          member_user_id: item.member?.user_id || '',
          member_name: item.member?.name || '',
          instrument_name: item.instrument?.name || '',
          teacher_name: item.teacher?.name || '',
          // allDay: true,
        }));
        setEvents(newEvents);
      }
    });
  }, []); // 의존성 배열에서 tableFilters.state 제거

  useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  useEffect(() => {
    onInitialView();
  }, [onInitialView]);

  // 검색어 변경 시 로컬 필터링만 수행하고 API는 호출하지 않음
  // 이렇게 하면 검색 시 버벅임이 줄어듦

  const canReset =
    filters.state.colors.length > 0 || (!!filters.state.startDate && !!filters.state.endDate);

  const tableFilterCanReset =
    !!tableFilters.state.searchKeyword || 
    (tableFilters.state.roleCheck1 && tableFilters.state.roleCheck1.length > 0);

  const dataFiltered = applyFilter({ 
    inputData: events, 
    filters: filters.state, 
    dateError,
    tableFilters: tableFilters.state,
    tableFilterDateError 
  });

  // 검색 필터 옵션 정의
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
    'member.user_id',
    'member.name',
    'instrument.name',
    'teacher.name',
  ];

  const flexProps = { flex: '1 1 auto', display: 'flex', flexDirection: 'column' };

  // 현재 보이는 날짜 범위에 속한 이벤트만 필터링
  const getVisibleEventsCount = useCallback((filteredEvents: ICalendarEvent[]) => {
    if (!visibleDateRange) return filteredEvents.length;
    
    const { start, end } = visibleDateRange;
    const startDate = dayjs(start);
    const endDate = dayjs(end);
    
    return filteredEvents.filter(event => {
      const eventDate = dayjs(event.start);
      return eventDate.isAfter(startDate) && eventDate.isBefore(endDate);
    }).length;
  }, [visibleDateRange]);

  // 캘린더 뷰가 변경될 때마다 현재 표시 범위 업데이트
  const handleDatesSet = useCallback((arg: any) => {
    setVisibleDateRange({
      start: arg.startStr,
      end: arg.endStr
    });
  }, []);

  // applyFilter 함수를 통해 필터링된 데이터가 업데이트될 때마다 보이는 이벤트 수 업데이트
  useEffect(() => {
    if (visibleDateRange) {
      setVisibleEventCount(getVisibleEventsCount(dataFiltered));
    } else {
      setVisibleEventCount(dataFiltered.length);
    }
  }, [dataFiltered, visibleDateRange, getVisibleEventsCount]);

  // FiltersResult 컴포넌트 커스터마이징
  const renderFiltersResult = tableFilterCanReset && (
    <ListTableFiltersResult
      filters={tableFilters}
      totalResults={visibleEventCount}
      onResetPage={() => {}}
      sx={{ p: 2.5, pt: 0 }}
    />
  );

  // 검색 필터 초기화 시 검색어 입력 필드도 초기화
  useEffect(() => {
    if (!tableFilters.state.searchKeyword) {
      setSearchValue('');
    }
  }, [tableFilters.state.searchKeyword]);

  return (
    <>
      <DashboardContent maxWidth="xl" sx={{ ...flexProps }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: { xs: 3, md: 5 } }}
        >
          {/* <Typography sx={{ fontSize:'18px', fontWeight : 'bold' }}>수업 스케줄 관리</Typography> */}
          {/* <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={onOpenForm}
          >
            새 스케줄
          </Button> */}
        </Stack>

        {/* 검색 필터 추가 */}
        <Card sx={{ mb: 3 }}>
          <CalendarSearchToolbar
            filters={tableFilters}
            dateError={tableFilterDateError}
            onResetPage={() => {}}
            options={{ roleCheck1, roleCheck2, roleKeyword }}
            searchValue={searchValue}
            onSearchChange={handleSearchChange}
          />

          {tableFilterCanReset && (
            <Box onClick={(e) => {
              // Chip의 삭제 버튼 클릭 시 텍스트필드의 값도 초기화
              const target = e.target as HTMLElement;
              if (target.tagName === 'svg' || target.closest('svg')) {
                const chipLabel = target.closest('.MuiChip-root')?.querySelector('.MuiChip-label')?.textContent;
                if (chipLabel === tableFilters.state.searchKeyword) {
                  setSearchValue('');
                }
              }
            }}>
              <ListTableFiltersResult
                filters={tableFilters}
                totalResults={visibleEventCount}
                onResetPage={() => {}}
                sx={{ p: 2.5, pt: 0 }}
              />
            </Box>
          )}
        </Card>

        <Card sx={{ ...flexProps, minHeight: '50vh' }}>
          <StyledCalendar sx={{ ...flexProps, '.fc.fc-media-screen': { flex: '1 1 auto' } }}>
            <CalendarToolbar
              date={fDate(date, 'YYYY년 MM월 DD일')}
              view={view}
              canReset={canReset}
              loading={eventsLoading}
              onNextDate={onDateNext}
              onPrevDate={onDatePrev}
              onToday={onDateToday}
              onChangeView={onChangeView}
              onOpenFilters={openFilters.onTrue}
            />

            <Calendar
              weekends
              // editable
              // droppable
              // selectable
              rerenderDelay={10}
              allDayMaintainDuration
              eventResizableFromStart
              ref={calendarRef}
              initialDate={date}
              initialView={view}
              locale="ko"
              dayMaxEventRows={3}
              eventDisplay="block"
              events={dataFiltered}
              headerToolbar={false}
              select={onSelectRange}
              // eventClick={onClickEvent}
              aspectRatio={3}
              datesSet={handleDatesSet}
              // eventDrop={(arg) => {
              //   onDropEvent(arg, updateEvent);
              // }}
              eventResize={(arg) => {
                onResizeEvent(arg, updateEvent);
              }}
              plugins={[
                listPlugin,
                dayGridPlugin,
                timelinePlugin,
                timeGridPlugin,
                interactionPlugin,
              ]}
            />
          </StyledCalendar>
        </Card>
      </DashboardContent>

      <Dialog
        fullWidth
        maxWidth="xs"
        open={openForm}
        onClose={onCloseForm}
        transitionDuration={{
          enter: theme.transitions.duration.shortest,
          exit: theme.transitions.duration.shortest - 80,
        }}
        PaperProps={{
          sx: {
            display: 'flex',
            overflow: 'hidden',
            flexDirection: 'column',
            '& form': { minHeight: 0, display: 'flex', flex: '1 1 auto', flexDirection: 'column' },
          },
        }}
      >
        <DialogTitle sx={{ minHeight: 76 }}>
          {openForm && <> 수업 스케줄 {currentEvent?.id ? '수정' : '생성'}</>}
        </DialogTitle>

        <CalendarForm
          currentEvent={currentEvent}
          colorOptions={CALENDAR_COLOR_OPTIONS}
          onClose={onCloseForm}
          onRefresh={() => loadClasses()}
        />
      </Dialog>

      <CalendarFilters
        events={events}
        filters={filters}
        canReset={canReset}
        dateError={dateError}
        open={openFilters.value}
        colorOptions={CALENDAR_COLOR_OPTIONS}
        onClose={openFilters.onFalse}
        onClickEvent={onClickEventInFilters}
      />
    </>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  dateError: boolean;
  filters: ICalendarFilters;
  inputData: ICalendarEvent[];
  tableFilters: ITableFilters;
  tableFilterDateError: boolean;
};

function applyFilter({ inputData, filters, dateError, tableFilters, tableFilterDateError }: ApplyFilterProps) {
  const { colors, startDate, endDate } = filters;

  const stabilizedThis = [...inputData];
  let filteredData = [...stabilizedThis];

  // 색상 필터 적용
  if (colors.length) {
    filteredData = filteredData.filter((event) => colors.includes(event.color as string));
  }

  // 기본 날짜 필터 적용
  if (!dateError) {
    if (startDate && endDate) {
      filteredData = filteredData.filter((event) => fIsBetween(event.start, startDate, endDate));
    }
  }

  // 테이블 필터 적용 (따로 함수로 분리하면 좋지만, 현재는 간단하게 구현)
  if (tableFilters.roleCheck1.length) {
    filteredData = filteredData.filter((event) => {
      const status = Number((event as any).status);
      // 상태에 따른 필터링 (10: 수업전, 20: 수업완료, 30: 수업불참)
      const statusText = status === 10 ? '수업전' : status === 20 ? '수업완료' : '수업불참';
      return tableFilters.roleCheck1.includes(statusText);
    });
  }

  // 검색어 필터 적용
  if (tableFilters.searchKeyword) {
    filteredData = filteredData.filter((event) => {
      const keyword = tableFilters.searchKeyword.toLowerCase();
      const customEvent = event as any;
      
      // 선택된 필터 타입에 따른 검색
      switch (tableFilters.roleKeyword) {
        case 'member.user_id':
          return (customEvent.member_user_id || '').toLowerCase().includes(keyword);
        
        case 'member.name':
          return (customEvent.member_name || '').toLowerCase().includes(keyword);
        
        case 'instrument.name':
          return (customEvent.instrument_name || '').toLowerCase().includes(keyword);
        
        case 'teacher.name':
          return (customEvent.teacher_name || '').toLowerCase().includes(keyword);
        
        default:
          // 기본적으로 제목 검색
          return (event.title || '').toLowerCase().includes(keyword);
      }
    });
  }

  return filteredData;
}
