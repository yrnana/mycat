import { Disclosure } from '@headlessui/react';
import { LockOpenIcon, MenuIcon, XIcon } from '@heroicons/react/outline';
import { Role } from '@prisma/client';
import cx from 'classnames';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { Toaster } from 'react-hot-toast';
import ActiveLink from '~/components/layout/ActiveLink';
import kakaoLoginImg from '~/public/static/images/kakao_login_medium.png';

const iconClassName = [
  'inline-flex items-center justify-center',
  'rounded-md p-2 focus:outline-none',
  'hover:text-white hover:bg-gray-700',
];

const Layout: React.FC = ({ children }) => {
  const { status, data } = useSession();

  if (status === 'loading') {
    return null;
  }

  const authenticated = status === 'authenticated';

  return (
    <div className="container mx-auto px-4">
      <header className="py-4 sm:py-10">
        <Disclosure as="nav">
          {({ open }) => (
            <>
              <div className="flex items-center">
                <Disclosure.Button
                  className={cx(...iconClassName, 'sm:hidden')}
                >
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
                <div className="hidden sm:flex items-center flex-grow space-x-1">
                  <ActiveLink href="/">행사</ActiveLink>
                  <ActiveLink href="/shops" className="!mr-auto">
                    쇼핑몰
                  </ActiveLink>
                  {data?.role === Role.ADMIN && (
                    <ActiveLink href="/admin">관리자</ActiveLink>
                  )}
                </div>
                {authenticated ? (
                  <button
                    className={cx(
                      ...iconClassName,
                      'sm:hover:text-black sm:hover:bg-gray-100 sm:px-6 sm:py-2',
                      'ml-auto sm:ml-1',
                    )}
                    onClick={() => signOut({ callbackUrl: '/' })}
                  >
                    <span className="sr-only">로그아웃</span>
                    <LockOpenIcon
                      className="block h-6 w-6"
                      aria-hidden="true"
                    />
                  </button>
                ) : (
                  <button
                    className="inline-flex ml-auto sm:ml-1"
                    onClick={() => signIn('kakao')}
                  >
                    <span className="sr-only">카카오 로그인</span>
                    <Image
                      src={kakaoLoginImg}
                      alt="카카오 로그인"
                      width={90}
                      height={45}
                    />
                  </button>
                )}
              </div>
              <Disclosure.Panel className="sm:hidden space-y-1 mt-4">
                <Disclosure.Button as={ActiveLink} href="/">
                  행사
                </Disclosure.Button>
                <Disclosure.Button as={ActiveLink} href="/shops">
                  쇼핑몰
                </Disclosure.Button>
                {data?.role === Role.ADMIN && (
                  <Disclosure.Button as={ActiveLink} href="/admin">
                    관리자
                  </Disclosure.Button>
                )}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </header>
      <main>{children}</main>
      <footer className="py-10 text-center text-gray-600">
        &copy; nana.na
      </footer>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            boxShadow:
              'rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px',
            padding: '0.75rem 1rem',
            color: '#ffffff',
            borderRadius: '.375rem',
            background: 'rgb(17, 24, 39)',
          },
        }}
      />
    </div>
  );
};

export default Layout;
