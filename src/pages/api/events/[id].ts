import type { NextApiRequest, NextApiResponse } from 'next';
import type { ErrorResponse, GetEventResponse } from '~/@types';
import { prisma } from '~/helpers/prisma';

export const config = {
  api: {
    externalResolver: true,
  },
};

// /api/events/:id
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    handleGET(req, res);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end();
  }
}

// GET /api/events/:id
async function handleGET(
  req: NextApiRequest,
  res: NextApiResponse<GetEventResponse | ErrorResponse>,
) {
  const eventId = req.query.id;
  const result = await prisma.event.findUnique({
    where: {
      id: String(eventId),
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
}
