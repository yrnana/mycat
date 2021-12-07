export const isClient = typeof window !== 'undefined';

export const DATABASE_URL = process.env.DATABASE_URL;
export const KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID;
export const KAKAO_CLIENT_SECRET = process.env.KAKAO_CLIENT_SECRET;
export const NODE_ENV = process.env.NODE_ENV;
export const SECRET = process.env.SECRET;
export const NEXTAUTH_URL = process.env.NEXTAUTH_URL;
export const VERCEL_URL = process.env.VERCEL_URL;

export const NEXT_PUBLIC_KAKAO_JS_APP_KEY =
  process.env.NEXT_PUBLIC_KAKAO_JS_APP_KEY;
export const NEXT_PUBLIC_KAKAO_CLIENT_ID =
  process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
export const NEXT_PUBLIC_VERCEL_URL = process.env.NEXT_PUBLIC_VERCEL_URL;

export const isDev = NODE_ENV === 'development';

export const placeholderBase64 =
  'data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAKAAgDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUG/8QAIRAAAgIBAwUBAAAAAAAAAAAAAQIDBCEAERIFBiIxQVH/xAAUAQEAAAAAAAAAAAAAAAAAAAAC/8QAFREBAQAAAAAAAAAAAAAAAAAAAAH/2gAMAwEAAhEDEQA/AN4ONNLIzQhkIDLLxt1pQzWGYMfaBhs0hPiihUB/Gp9KeWr3ZcgrSvDAavT5DHGxVS0jW2kbYY3Zsk/Tk6aEN//Z';
