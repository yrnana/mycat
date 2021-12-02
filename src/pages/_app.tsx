import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Layout from '~/components/layout/Layout';
import '~/styles/globals.css';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  // https://nextjs.org/docs/basic-features/layouts#per-page-layouts
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>);

  return (
    <>
      <Head>
        <title>Cat App</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <SessionProvider session={session}>
        {getLayout(<Component {...pageProps} />)}
      </SessionProvider>
    </>
  );
}

export default MyApp;
