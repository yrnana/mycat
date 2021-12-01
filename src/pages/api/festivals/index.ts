import type { Prisma } from '@prisma/client';
import { sortBy } from 'lodash-es';
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '~/helpers/prisma';
import type {
  ErrorResponse,
  GetFestivalResponse,
  GetFestivalsResponse,
  PostFestivalsRequestBody,
} from '~/types';

// /api/festivals
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    handleGET(req, res);
  } else if (req.method === 'POST') {
    handlePOST(req, res);
  } else {
    res.status(405).json({ error: true });
  }
}

// GET /api/festivals
async function handleGET(
  req: NextApiRequest,
  res: NextApiResponse<GetFestivalsResponse | ErrorResponse>,
) {
  const result = await prisma.festival.findMany({
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

// POST /api/festivals
async function handlePOST(
  req: NextApiRequest,
  res: NextApiResponse<GetFestivalResponse | ErrorResponse>,
) {
  const {
    festivals,
    dates,
    place: { id, ...place },
  } = req.body as PostFestivalsRequestBody;

  const data: Prisma.FestivalCreateInput = {
    ...festivals,
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

  const result = (await prisma.festival.create({
    data,
  })) as GetFestivalResponse;

  res.json(result);
}
