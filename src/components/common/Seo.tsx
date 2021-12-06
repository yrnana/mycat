import Head from 'next/head';
import { useRouter } from 'next/router';
import { NEXT_PUBLIC_VERCEL_URL } from '~/helpers/constants';

type SeoProps = {
  title?: string;
  description?: string;
  url?: string;
  image?: string; // static 폴더 절대경로
};

export default function Seo({
  title = 'My Cat',
  description,
  url,
  image = `/static/images/placeholder.jpg`,
}: SeoProps) {
  const { asPath } = useRouter();

  return (
    <Head>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      {description && <meta name="description" content={description} />}
      <meta property="og:type" content="website" />
      <meta
        property="og:url"
        content={url || `${NEXT_PUBLIC_VERCEL_URL}${asPath}`}
      />
      <meta property="og:image" content={`${NEXT_PUBLIC_VERCEL_URL}${image}`} />
    </Head>
  );
}
