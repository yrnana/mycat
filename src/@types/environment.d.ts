/* eslint-disable @typescript-eslint/no-unused-vars */
namespace NodeJS {
  interface ProcessEnv extends NodeJS.ProcessEnv {
    NEXT_PUBLIC_BASE_URL: string;
    DATABASE_URL: string;
    KAKAO_CLIENT_ID: string;
    NEXT_PUBLIC_KAKAO_CLIENT_ID: string;
    NEXT_PUBLIC_KAKAO_JS_APP_KEY: string;
    KAKAO_CLIENT_SECRET: string;
    SECRET: string;
  }
}
