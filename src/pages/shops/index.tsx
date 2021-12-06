import Head from 'next/head';

type Props = {
  foo: string;
};

export default function Shop(props: Props) {
  return (
    <>
      <Head>
        <title>고양이 쇼핑몰 : My Cat</title>
        <meta name="description" content="고양이 쇼핑몰 목록" />
      </Head>
      Hello Shop
    </>
  );
}
