import type { Event, EventDate, Place, Prisma } from '@prisma/client';

export type GetEventResponse = Omit<Event, 'placeholder'> & {
  placeholder: string | null;
} & {
  dates: EventDate[];
  place: Place;
};

export type GetEventsResponse = GetEventResponse[];

export type PostUploadsResponse = {
  files: Express.Multer.File[];
};

export type PostEventsRequestBody = {
  event: Omit<Prisma.EventCreateInput, 'dates' | 'place'>;
  dates: Prisma.EventDateCreateWithoutEventInput[];
  place: Omit<Prisma.PlaceUncheckedCreateInput, 'event'>;
};

export type ErrorResponse = {
  error: boolean | string;
};

export type KakaoPlaceMeta = {
  totalCount: number;
  pageableCount: number;
  isEnd: boolean;
  sameName: {
    region: string[];
    keyword: string;
    selectedRegion: string;
  };
};

export type KakaoPlaceDocument = {
  id: string;
  placeName: string;
  categoryName: string;
  categoryGroupCode: string;
  categoryGroupName: string;
  phone: string;
  addressName: string;
  roadAddressName: string;
  x: string;
  y: string;
  placeUrl: string;
  distance: string;
};

export type KakaoPlace = {
  meta: KakaoPlaceMeta;
  documents: KakaoPlaceDocument[];
};
