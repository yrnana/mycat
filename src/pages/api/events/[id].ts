import type { Prisma } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import type {
  ErrorResponse,
  GetEventResponse,
  PostEventsRequestBody,
} from '~/@types';
import { allowAdminOnly } from '~/helpers/middleware';
import { prisma } from '~/helpers/prisma';

const handler = nc<NextApiRequest, NextApiResponse>({
  onError(error, req, res) {
    console.error(error);
    res
      .status(501)
      .json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

// GET /api/events/:id
handler.get(
  async (req, res: NextApiResponse<GetEventResponse | ErrorResponse>) => {
    const eventId = String(req.query.id);
    const result = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
      include: {
        dates: {
          orderBy: {
            startTime: 'asc',
          },
        },
        place: true,
      },
    });

    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ error: true });
    }
  },
);

handler.use(allowAdminOnly);

// PUT /api/events/:id
handler.put(
  async (req, res: NextApiResponse<GetEventResponse | ErrorResponse>) => {
    const eventId = String(req.query.id);
    const { event, dates, place } = req.body as PostEventsRequestBody;

    const data: Prisma.EventUpdateInput = {
      ...event,
      dates: {
        deleteMany: {
          eventId,
        },
        create: dates,
      },
      place: {
        connectOrCreate: {
          where: {
            id: place.id,
          },
          create: place,
        },
      },
    };

    const result = (await prisma.event.update({
      where: {
        id: eventId,
      },
      data,
    })) as GetEventResponse;

    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ error: true });
    }
  },
);

handler.delete(async (req, res) => {
  const eventId = String(req.query.id);

  const result = await prisma.event.delete({
    where: { id: eventId },
  });

  res.json(result);
});

export default handler;
