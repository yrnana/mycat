/* eslint-disable @typescript-eslint/no-unused-vars */
import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    isAdmin: boolean;
  }

  interface User {
    isAdmin: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    isAdmin: boolean;
  }
}
