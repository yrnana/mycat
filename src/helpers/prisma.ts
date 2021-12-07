import { PrismaClient } from '@prisma/client';
import { isDev } from '~/helpers/constants';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (isDev) global.prisma = prisma;
