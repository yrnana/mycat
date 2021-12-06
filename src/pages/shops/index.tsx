import Seo from '~/components/common/Seo';

type Props = {
  foo: string;
};

export default function Shop(props: Props) {
  return (
    <>
      <Seo title="고양이 쇼핑몰 : My Cat" description="고양이 쇼핑몰 목록" />
      Hello Shop
    </>
  );
}
