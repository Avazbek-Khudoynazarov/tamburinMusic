import type { ICalendarEvent } from '@/components/UI/Minimal/types/calendar';

import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axios, { fetcher, endpoints } from '@/utils/axios';

import AuthService from '@/services/AuthService';
//import ClassesService from '@/services/ClassesService';

// ----------------------------------------------------------------------

const enableServer = false;

const CALENDAR_ENDPOINT = endpoints.calendar;

const swrOptions = {
  revalidateIfStale: enableServer,
  revalidateOnFocus: enableServer,
  revalidateOnReconnect: enableServer,
};

// ----------------------------------------------------------------------

type EventsData = {
  events: ICalendarEvent[];
};
export function useGetEvents() {
  const { data, isLoading, error, isValidating } = useSWR<EventsData>(
    ['/manage/meta/list', { headers: { Authorization: `Bearer ${AuthService.getToken()}` } }],
    fetcher,
    swrOptions
  );

  const memoizedValue = useMemo(() => {
    const events = data?.events.map((event) => ({
      ...event,
      textColor: event.color,
    }));

    return {
      events: events || [],
      eventsLoading: isLoading,
      eventsError: error,
      eventsValidating: isValidating,
      eventsEmpty: !isLoading && !data?.events.length,
    };
  }, [data?.events, error, isLoading, isValidating]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function createEvent(eventData: ICalendarEvent) {
  /**
   * Work on server
   */
  if (enableServer) {
    const data = { eventData };
    await axios.post(CALENDAR_ENDPOINT, data);
  }

  // await ClassesService.create({
  //   member_id: eventData.member_id,
  //   payments_id: 0,
  //   status: 10,
  //   classes_date: new Date(eventData.start as string),
  //   created_date: new Date()
  // });

  /**
   * Work in local
   */
  mutate(
    CALENDAR_ENDPOINT,
    (currentData: any) => {
      const currentEvents: ICalendarEvent[] = currentData?.events;

      const events = [...currentEvents, eventData];

      return { ...currentData, events };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function updateEvent(eventData: Partial<ICalendarEvent>) {
  /**
   * Work on server
   */
  if (enableServer) {
    const data = { eventData };
    await axios.put(CALENDAR_ENDPOINT, data);
  }
  
  // 수강생 상태 업데이트
  /*
  await ClassesService.update({
    id: Number(eventData.id),
    classes_date: new Date(eventData.start as string),
    member_id: eventData.member_id as number,
    payments_id: 0,
    status: 0,
    created_date: new Date()
  });
  */
  /**
   * Work in local
   */
  mutate(
    CALENDAR_ENDPOINT,
    (currentData: any) => {
      const currentEvents: ICalendarEvent[] = currentData?.events;

      const events = currentEvents.map((event) =>
        event.id === eventData.id ? { ...event, ...eventData } : event
      );

      return { ...currentData, events };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function deleteEvent(eventId: string) {
  /**
   * Work on server
   */
  if (enableServer) {
    const data = { eventId };
    await axios.patch(CALENDAR_ENDPOINT, data);
  }

  /**
   * Work in local
   */
  mutate(
    CALENDAR_ENDPOINT,
    (currentData: any) => {
      const currentEvents: ICalendarEvent[] = currentData?.events;

      const events = currentEvents.filter((event) => event.id !== eventId);

      return { ...currentData, events };
    },
    false
  );
}
