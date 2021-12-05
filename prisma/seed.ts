import { Event, EventDate, Place, PrismaClient } from '@prisma/client';

const placeSeeds: Place[] = [
  {
    id: 8106109,
    name: '코엑스 D홀',
    lat: 37.51235237999761,
    lng: 127.05901053033,
  },
  {
    id: 8360965,
    name: 'SETEC',
    lat: 37.495683550002,
    lng: 127.071966780003,
  },
];

const eventSeeds: Omit<Event, 'id'>[] = [
  {
    name: '2022 케이캣페어 서울',
    placeId: 8106109,
    placeDetail: null,
    image: '/uploads/k_cat_fair_2022_1.png',
    homepage: 'https://k-cat.co.kr/2022cat_coex/',
  },
  {
    name: '제19회 궁디팡팡 캣페스타',
    placeId: 8360965,
    placeDetail: null,
    image: '/uploads/cat_festa_2021_12.jpeg',
    homepage: 'https://www.gdppcat.com/',
  },
];

const prisma = new PrismaClient();

async function seed() {
  await Promise.all(placeSeeds.map((data) => prisma.place.create({ data })));

  const events = await Promise.all(
    eventSeeds.map((data) => prisma.event.create({ data })),
  );

  const dateSeeds: EventDate[] = [];
  events.forEach((event) => {
    if (event.name === '2022 케이캣페어 서울') {
      dateSeeds.push(
        {
          eventId: event.id,
          startTime: new Date('2022-01-21T10:00:00'),
          endTime: new Date('2022-01-21T18:00:00'),
          closingTime: new Date('2022-01-21T17:30:00'),
        },
        {
          eventId: event.id,
          startTime: new Date('2022-01-22T10:00:00'),
          endTime: new Date('2022-01-22T18:00:00'),
          closingTime: new Date('2022-01-22T17:30:00'),
        },
        {
          eventId: event.id,
          startTime: new Date('2022-01-23T10:00:00'),
          endTime: new Date('2022-01-23T18:00:00'),
          closingTime: new Date('2022-01-23T17:30:00'),
        },
      );
    } else {
      dateSeeds.push(
        {
          eventId: event.id,
          startTime: new Date('2021-12-03T10:00:00'),
          endTime: new Date('2021-12-03T18:00:00'),
          closingTime: new Date('2021-12-03T17:30:00'),
        },
        {
          eventId: event.id,
          startTime: new Date('2021-12-04T10:00:00'),
          endTime: new Date('2021-12-04T18:00:00'),
          closingTime: new Date('2021-12-04T17:30:00'),
        },
        {
          eventId: event.id,
          startTime: new Date('2021-12-05T10:00:00'),
          endTime: new Date('2021-12-05T17:30:00'),
          closingTime: new Date('2021-12-05T17:00:00'),
        },
      );
    }
  });
  await Promise.all(dateSeeds.map((data) => prisma.eventDate.create({ data })));
}

seed();
