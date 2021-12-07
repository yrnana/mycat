import type { Prisma } from '@prisma/client';
import { sortBy } from 'lodash-es';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { getPlaiceholder } from 'plaiceholder';
import type {
  ErrorResponse,
  GetEventResponse,
  GetEventsResponse,
  PostEventsRequestBody,
} from '~/@types';
import { VERCEL_URL } from '~/helpers/constants';
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

// GET /api/events
handler.get(
  async (req, res: NextApiResponse<GetEventsResponse | ErrorResponse>) => {
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

    const events: GetEventsResponse = result.map((event) => ({
      ...event,
      placeholder: event.placeholder
        ? Buffer.from(event.placeholder).toString()
        : null,
    }));

    res.json(sortBy(events, ({ dates }) => dates[0].startTime));
  },
);

handler.use(allowAdminOnly);

// POST /api/events
handler.post(
  async (req, res: NextApiResponse<GetEventResponse | ErrorResponse>) => {
    const { event, dates, place } = req.body as PostEventsRequestBody;

    const data: Prisma.EventCreateInput = {
      ...event,
      dates: {
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

    if (event.image) {
      const { base64 } = await getPlaiceholder(`${VERCEL_URL}${event.image}`, {
        size: 10,
      });
      data.placeholder = Buffer.from(base64);
    }

    const result = (await prisma.event.create({
      data,
    })) as GetEventResponse;

    res.json(result);
  },
);

export default handler;
