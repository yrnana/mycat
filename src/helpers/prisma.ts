import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const isDev = process.env.NODE_ENV !== 'production';

export const prisma =
  global.prisma ||
  new PrismaClient(
    isDev
      ? {
          log: ['query'],
        }
      : undefined,
  );

if (isDev) global.prisma = prisma;
