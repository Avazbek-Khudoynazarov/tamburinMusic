import type { IDatePickerControl } from '@/components/UI/Minimal/types/common';
import type { UseSetStateReturn } from '@/components/UI/Minimal/hooks/use-set-state';
import type { ICalendarEvent, ICalendarFilters } from '@/components/UI/Minimal/types/calendar';

import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { orderBy } from '@/utils/helper';
import { fDate, fDateTime } from '@/utils/format-time';

import { Iconify } from '@/components/UI/Minimal/components/iconify';
import { Scrollbar } from '@/components/UI/Minimal/components/scrollbar';
import { ColorPicker } from '@/components/UI/Minimal/components/color-utils';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  canReset: boolean;
  dateError: boolean;
  onClose: () => void;
  colorOptions: string[];
  events: ICalendarEvent[];
  onClickEvent: (eventId: string) => void;
  filters: UseSetStateReturn<ICalendarFilters>;
};

export function CalendarFilters({
  open,
  events,
  onClose,
  filters,
  canReset,
  dateError,
  colorOptions,
  onClickEvent,
}: Props) {
  const handleFilterColors = useCallback(
    (newValue: string | string[]) => {
      filters.setState({ colors: newValue as string[] });
    },
    [filters]
  );

  const handleFilterStartDate = useCallback(
    (newValue: IDatePickerControl) => {
      filters.setState({ startDate: newValue });
    },
    [filters]
  );

  const handleFilterEndDate = useCallback(
    (newValue: IDatePickerControl) => {
      filters.setState({ endDate: newValue });
    },
    [filters]
  );

  const renderHead = (
    <>
      <Box display="flex" alignItems="center" sx={{ py: 2, pr: 1, pl: 2.5 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          필터
        </Typography>

        <Tooltip title="Reset">
          <IconButton onClick={filters.onResetState}>
            <Badge color="error" variant="dot" invisible={!canReset}>
              <Iconify icon="solar:restart-bold" />
            </Badge>
          </IconButton>
        </Tooltip>

        <IconButton onClick={onClose}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      </Box>

      <Divider sx={{ borderStyle: 'dashed' }} />
    </>
  );

  const renderColors = (
    <Box display="flex" flexDirection="column" sx={{ my: 3, px: 2.5 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        색상
      </Typography>
      <ColorPicker
        colors={colorOptions}
        selected={filters.state.colors}
        onSelectColor={handleFilterColors}
      />
    </Box>
  );

  const renderDateRange = (
    <Box display="flex" flexDirection="column" sx={{ mb: 3, px: 2.5 }}>
      <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
        범위
      </Typography>

      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='ko'>  
        <DatePicker
          label="시작일"
          value={filters.state.startDate}
          onChange={handleFilterStartDate}
          sx={{ mb: 2.5 }}
          localeText={{
            month: '월',
            year: '년',
            day: '일'
          }}
        />
      </LocalizationProvider>

      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='ko'>  
        <DatePicker
          label="종료일"
          value={filters.state.endDate}
          onChange={handleFilterEndDate}
          slotProps={{
            textField: {
              error: dateError,
              helperText: dateError ? 'End date must be later than start date' : null,
            },
          }}
        />
      </LocalizationProvider>
    </Box>
  );

  const renderEvents = (
    <>
      <Typography variant="subtitle2" sx={{ px: 2.5, mb: 1 }}>
        스케줄 ({events.length})
      </Typography>

      <Box component="ul">
        {orderBy(events, ['end'], ['desc']).map((event) => (
          <Box component="li" key={event.id}>
            <ListItemButton
              onClick={() => onClickEvent(`${event.id}`)}
              sx={{ py: 1.5, borderBottom: (theme) => `dashed 1px ${theme.vars.palette.divider}` }}
            >
              <Box
                sx={{
                  top: 16,
                  left: 0,
                  width: 0,
                  height: 0,
                  position: 'absolute',
                  borderRight: '10px solid transparent',
                  borderTop: `10px solid ${event.color}`,
                }}
              />

              <ListItemText
                disableTypography
                primary={
                  <Typography variant="subtitle2" sx={{ fontSize: 13, mt: 0.5 }}>
                    {event.title}
                  </Typography>
                }
                secondary={
                  <Typography
                    variant="caption"
                    component="div"
                    sx={{ fontSize: 11, color: 'text.disabled' }}
                  >
                    {event.allDay
                      ? fDate(event.start, 'YYYY년 MM월 DD일')
                      : `${fDateTime(event.start, 'YYYY년 MM월 DD일 HH:mm')} - ${fDateTime(event.end, 'YYYY년 MM월 DD일 HH:mm')}`}
                  </Typography>
                }
                sx={{ display: 'flex', flexDirection: 'column-reverse' }}
              />
            </ListItemButton>
          </Box>
        ))}
      </Box>
    </>
  );

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{ backdrop: { invisible: true } }}
      PaperProps={{ sx: { width: 320 } }}
    >
      {renderHead}

      <Scrollbar>
        {renderColors}
        {renderDateRange}
        {renderEvents}
      </Scrollbar>
    </Drawer>
  );
}
