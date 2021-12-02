import type { NextApiRequest, NextApiResponse } from 'next';
import type { ErrorResponse, GetFestivalResponse } from '~/@types';
import { prisma } from '~/helpers/prisma';

export const config = {
  api: {
    externalResolver: true,
  },
};

// /api/festivals/:id
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

// GET /api/festivals/:id
async function handleGET(
  req: NextApiRequest,
  res: NextApiResponse<GetFestivalResponse | ErrorResponse>,
) {
  const postId = req.query.id;
  const result = await prisma.festival.findUnique({
    where: {
      id: Number(postId),
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
