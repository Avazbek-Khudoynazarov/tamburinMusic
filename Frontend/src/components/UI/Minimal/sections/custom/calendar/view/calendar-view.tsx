import Calendar from '@fullcalendar/react'; // => request placed at the top
import type { ICalendarEvent, ICalendarFilters } from '@/components/UI/Minimal/types/calendar';
import dayjs from 'dayjs';

import { useEffect, useState } from 'react';
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

import { useBoolean } from '@/components/UI/Minimal/hooks//use-boolean';
import { useSetState } from '@/components/UI/Minimal/hooks//use-set-state';

import { fDate, fIsAfter, fIsBetween } from '@/utils/format-time';

import { DashboardContent } from '@/components/UI/Minimal/layouts/dashboard';
import { CALENDAR_COLOR_OPTIONS } from '@/components/UI/Minimal/_mock/_calendar';
import { updateEvent, useGetEvents } from '@/components/UI/Minimal/actions/calendar';

import { Iconify } from '@/components/UI/Minimal/components/iconify';
import { paths } from '@/components/UI/Minimal/routes/paths';

import { IClassesItem } from '@/components/UI/Minimal/types/user';

import { StyledCalendar } from '../styles';
import { useEvent } from '../hooks/use-event';
import { CalendarForm } from '../calendar-form';
import { useCalendar } from '../hooks/use-calendar';
import { CalendarToolbar } from '../calendar-toolbar';
import { CalendarFilters } from '../calendar-filters';
import { CalendarFiltersResult } from '../calendar-filters-result';
import useGlobalStore from '@/stores/globalStore';

import ClassesService from '@/services/ClassesService';

// ----------------------------------------------------------------------

export function CalendarView() {
  const [events, setEvents] = useState<ICalendarEvent[]>([]);
  const theme = useTheme();
	const { member } = useGlobalStore();

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

  const dateError = fIsAfter(filters.state.startDate, filters.state.endDate);

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

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    onInitialView();
  }, [onInitialView]);

  const loadClasses = async () => {
		let list = [];
		if(member?.type === 10) {
			list = await ClassesService.getByMemberId(member?.id ?? 0);
		} else {
			list = await ClassesService.getByTeacherId(member?.id ?? 0);
		}
		if(list) {
			const newEvents = list.map((item: IClassesItem) => ({
				id: item.id?.toString(),
				member_id: item.member_id,
				status: item.status,
				title: member?.type === 10 ?  `${item.instrument?.name} 레슨` : `${item.member?.name} 수업`,
				start: dayjs(item.classes_date).format(),
				end: dayjs(item.classes_date).add(1, "minute").format(),
				textColor: item.status === 10 ? "#a3a3a3" : item.status === 20 ? "#000000" : "#f44336",
				url: `/mypage/classrooms/${item.id?.toString()}`,
			}));
			// console.log(newEvents);
			setEvents(newEvents as any);
		}
    /*
    ClassesService.getAllList().then((data) => {
      if(data) {
        const newEvents = data.map((item: IClassesItem) => ({
          id: item.id?.toString(),
          member_id: item.member_id,
          status: item.status,
          title: `${item.member?.name} ${item.instrument?.name} / ${item.curriculum?.name}`,
          // title: `${item.member?.name} ${item.instrument?.name} ${dayjs(item.classes_date).format('A hh:mm').replace('AM', '오전').replace('PM', '오후')}`,
          start: dayjs(item.classes_date).format(),
          end: dayjs(item.classes_date).format(),
					textColor: item.status === 10 ? "#a3a3a3" : item.status === 20 ? "#000000" : "#f44336",
					url: paths.payments.edit(item.payments_id.toString(), item.id?.toString()),

          // allDay: true,
        }));
        setEvents(newEvents);
      }
    });
    */
  }

  const canReset =
    filters.state.colors.length > 0 || (!!filters.state.startDate && !!filters.state.endDate);

  const dataFiltered = applyFilter({ inputData: events, filters: filters.state, dateError });

  const renderResults = (
    <CalendarFiltersResult
      filters={filters}
      totalResults={dataFiltered.length}
      sx={{ mb: { xs: 3, md: 5 } }}
    />
  );

  const flexProps = { flex: '1 1 auto', display: 'flex', flexDirection: 'column' };

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

        {canReset && renderResults}

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
        onClose={openFilters.onFalse}
        onClickEvent={onClickEventInFilters}
        colorOptions={CALENDAR_COLOR_OPTIONS}
      />
    </>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  dateError: boolean;
  filters: ICalendarFilters;
  inputData: ICalendarEvent[];
};

function applyFilter({ inputData, filters, dateError }: ApplyFilterProps) {
  const { colors, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  inputData = stabilizedThis.map((el) => el[0]);

  if (colors.length) {
    inputData = inputData.filter((event) => colors.includes(event.color as string));
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((event) => fIsBetween(event.start, startDate, endDate));
    }
  }

  return inputData;
}
