import type { NextComponentType, NextPageContext } from 'next';
import type { Session } from 'next-auth';
import type { Router } from 'next/router';

declare module 'next/app' {
  type AppProps<P = Record<string, unknown>> = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Component: NextComponentType<NextPageContext, any, P> & {
      getLayout?: (page: React.ReactElement) => React.ReactNode;
    };
    router: Router;
    __N_SSG?: boolean;
    __N_SSP?: boolean;
    pageProps: P & {
      session?: Session;
    };
  };
}
