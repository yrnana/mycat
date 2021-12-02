import type { Festival, FestivalDate, Place, Prisma } from '@prisma/client';

export type GetFestivalResponse = Festival & {
  dates: FestivalDate[];
  place: Place;
};

export type GetFestivalsResponse = GetFestivalResponse[];

export type PostFestivalsRequestBody = {
  festivals: Omit<Prisma.FestivalCreateInput, 'dates' | 'place'>;
  dates: Prisma.FestivalDateCreateWithoutFestivalInput[];
  place: Omit<Prisma.PlaceUncheckedCreateInput, 'festival'>;
};

export type ErrorResponse = {
  error: boolean | string;
};
