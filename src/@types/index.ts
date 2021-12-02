import type { Event, EventDate, Place, Prisma } from '@prisma/client';

export type GetEventResponse = Event & {
  dates: EventDate[];
  place: Place;
};

export type GetEventsResponse = GetEventResponse[];

export type PostEventsRequestBody = {
  events: Omit<Prisma.EventCreateInput, 'dates' | 'place'>;
  dates: Prisma.EventDateCreateWithoutEventInput[];
  place: Omit<Prisma.PlaceUncheckedCreateInput, 'event'>;
};

export type ErrorResponse = {
  error: boolean | string;
};
