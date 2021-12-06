import type { GetServerSideProps } from 'next';
import { getSession, signIn } from 'next-auth/react';
import Image from 'next/image';
import kakaoLoginMediumImg from '~/public/static/images/kakao_login_medium.png';
import kakaoLoginLargeImg from '~/public/static/images/kakao_login_medium.png';

export default function SignIn() {
  return (
    <div className="flex flex-col justify-center items-center h-60 sm:h-96">
      <h2 className="text-xl font-medium mb-8">
        카카오로 간편하게 로그인하세요
      </h2>
      <button className="inline-flex sm:hidden" onClick={() => signIn('kakao')}>
        <span className="sr-only">카카오 로그인</span>
        <Image
          src={kakaoLoginMediumImg}
          alt="카카오 로그인"
          width={183}
          height={45}
        />
      </button>
      <button className="sm:inline-flex hidden" onClick={() => signIn('kakao')}>
        <span className="sr-only">카카오 로그인</span>
        <Image
          src={kakaoLoginLargeImg}
          alt="카카오 로그인"
          width={366}
          height={90}
        />
      </button>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
