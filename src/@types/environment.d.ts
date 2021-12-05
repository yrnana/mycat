/* eslint-disable @typescript-eslint/no-unused-vars */
namespace NodeJS {
  interface ProcessEnv extends NodeJS.ProcessEnv {
    DATABASE_URL: string;
    KAKAO_CLIENT_ID: string;
    NEXT_PUBLIC_KAKAO_CLIENT_ID: string;
    KAKAO_CLIENT_SECRET: string;
    SECRET: string;
    VERCEL_URL: string;
    NEXT_PUBLIC_VERCEL_URL: string;
  }
}
