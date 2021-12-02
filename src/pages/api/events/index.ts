import type { Prisma } from '@prisma/client';
import { sortBy } from 'lodash-es';
import type { NextApiRequest, NextApiResponse } from 'next';
import type {
  ErrorResponse,
  GetEventResponse,
  GetEventsResponse,
  PostEventsRequestBody,
} from '~/@types';
import { prisma } from '~/helpers/prisma';

export const config = {
  api: {
    externalResolver: true,
  },
};

// /api/events
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    handleGET(req, res);
  } else if (req.method === 'POST') {
    handlePOST(req, res);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end();
  }
}

// GET /api/events
async function handleGET(
  req: NextApiRequest,
  res: NextApiResponse<GetEventsResponse | ErrorResponse>,
) {
  const result = await prisma.event.findMany({
    include: {
      dates: {
        orderBy: {
          startTime: 'asc',
        },
      },
      place: true,
    },
  });

  res.json(sortBy(result, (v) => v.dates[0].startTime));
}

// POST /api/events
async function handlePOST(
  req: NextApiRequest,
  res: NextApiResponse<GetEventResponse | ErrorResponse>,
) {
  const {
    events,
    dates,
    place: { id, ...place },
  } = req.body as PostEventsRequestBody;

  const data: Prisma.EventCreateInput = {
    ...events,
    dates: {
      create: dates,
    },
    place: {
      connectOrCreate: {
        where: {
          id,
        },
        create: place,
      },
    },
  };

  const result = (await prisma.event.create({
    data,
  })) as GetEventResponse;

  res.json(result);
}
