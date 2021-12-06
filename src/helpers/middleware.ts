import { Role } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import type { Middleware } from 'next-connect';

export const allowAdminOnly: Middleware<
  NextApiRequest,
  NextApiResponse
> = async (req, res, next) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401);
  }
  if (session.role !== Role.ADMIN) {
    return res.status(403);
  }

  next();
};

export const allowMemberOnly: Middleware<
  NextApiRequest,
  NextApiResponse
> = async (req, res, next) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401);
  }

  next();
};
