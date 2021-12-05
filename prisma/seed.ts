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
    image:
      'https://s3-ap-northeast-2.amazonaws.com/esang-kcat/wp-content/uploads/2021/11/23014247/22_1%EC%9B%94%EC%BD%94%EC%97%91%EC%8A%A4%EC%BA%A3_01.png',
    homepage: 'https://k-cat.co.kr/2022cat_coex/',
  },
  {
    name: '제19회 궁디팡팡 캣페스타',
    placeId: 8360965,
    placeDetail: null,
    image: 'https://www.gdppcat.com/images/last/19_poster.jpg',
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
