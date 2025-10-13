import type { ICalendarEvent } from 'src/types/calendar';

import { z as zod } from 'zod';
import { useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogActions from '@mui/material/DialogActions';

import { uuidv4 } from 'src/utils/uuidv4';
import { fIsAfter } from 'src/utils/format-time';

import { createEvent, updateEvent, deleteEvent } from 'src/actions/calendar';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { Form, Field } from 'src/components/hook-form';
import { ColorPicker } from 'src/components/color-utils';

import ClassesService from 'src/services/ClassesService';

// ----------------------------------------------------------------------

export type EventSchemaType = zod.infer<typeof EventSchema>;

export const EventSchema = zod.object({
  // title: zod
  //   .string()
  //   .min(1, { message: 'Title is required!' })
  //   .max(100, { message: 'Title must be less than 100 characters' }),
  // description: zod
  //   .string()
  //   .min(1, { message: 'Description is required!' })
  //   .min(50, { message: 'Description must be at least 50 characters' }),
  // Not required
  title: zod.string(),
  description: zod.string(),
  color: zod.string(),
  allDay: zod.boolean(),
  start: zod.union([zod.string(), zod.number()]),
  end: zod.union([zod.string(), zod.number()]),
});

// ----------------------------------------------------------------------

type Props = {
  colorOptions: string[];
  onClose: () => void;
  onRefresh: () => void;
  currentEvent?: ICalendarEvent;
};

export function CalendarForm({ currentEvent, colorOptions, onClose, onRefresh }: Props) {
  const methods = useForm<EventSchemaType>({
    mode: 'all',
    resolver: zodResolver(EventSchema),
    defaultValues: currentEvent,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const dateError = false; // fIsAfter(values.start, values.end);

  const onSubmit = handleSubmit(async (data) => {
    const eventData = {
      id: currentEvent?.id ? currentEvent?.id : uuidv4(),
      member_id: currentEvent?.member_id ? currentEvent?.member_id : 0,
      status: currentEvent?.status ? currentEvent?.status : 0,
      color: data?.color,
      title: data?.title,
      allDay: data?.allDay,
      description: data?.description,
      end: data?.end,
      start: data?.start,
    };

    try {
      if (!dateError) {
        if (currentEvent?.id) {
          await updateEvent(eventData);
          toast.success('스케줄을 업데이트하였습니다.');
        } else {
          await createEvent(eventData);
          toast.success('스케줄을 생성하였습니다.');
        }
        onClose();
        reset();
        onRefresh();
      }
    } catch (error) {
      console.error(error);
    }
  });

  const onDelete = useCallback(async () => {
    try {
      await ClassesService.delete(Number(currentEvent?.id));
      await deleteEvent(`${currentEvent?.id}`);
      toast.success('스케줄이 삭제되었습니다.');
      onClose();
      onRefresh();
    } catch (error) {
      console.error(error);
    }
  }, [currentEvent?.id, onClose, onRefresh]);

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Scrollbar sx={{ p: 3, bgcolor: 'background.neutral' }}>
        <Stack spacing={3}>
          {/* <Field.Text name="title" label="Title" /> */}

          {/* <Field.Text name="description" label="Description" multiline rows={3} /> */}

          {/* <Field.Switch name="allDay" label="All day" /> */}  

          <Field.MobileDateTimePicker name="start" label="수업 날짜" />

          {/* <Field.MobileDateTimePicker
            name="end"
            label="End date"
            slotProps={{
              textField: {
                error: dateError,
                helperText: dateError ? 'End date must be later than start date' : null,
              },
            }}
          />

          <Controller
            name="color"
            control={control}
            render={({ field }) => (
              <ColorPicker
                selected={field.value as string}
                onSelectColor={(color) => field.onChange(color as string)}
                colors={colorOptions}
              />
            )}
          /> */}
        </Stack>
      </Scrollbar>

      <DialogActions sx={{ flexShrink: 0 }}>
        {!!currentEvent?.id && (
          <Tooltip title="스케줄 삭제">
            <IconButton onClick={onDelete}>
              <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>
          </Tooltip>
        )}

        <Box sx={{ flexGrow: 1 }} />

        <Button variant="outlined" color="inherit" onClick={onClose}>
          취소
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          loading={isSubmitting}
          disabled={dateError}
        >
          저장
        </LoadingButton>
      </DialogActions>
    </Form>
  );
}
