import { Role } from '@prisma/client';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { Toaster } from 'react-hot-toast';
import ActiveLink, { linkClassName } from '~/components/layout/ActiveLink';

const Layout: React.FC = ({ children }) => {
  const { status, data } = useSession();
  const authenticated = status === 'authenticated';

  return (
    <div className="container mx-auto px-4">
      <header className="py-10">
        <nav className="flex items-center text-lg font-medium">
          <ActiveLink href="/">행사</ActiveLink>
          <ActiveLink href="/shops" className="mr-auto">
            쇼핑몰
          </ActiveLink>
          {data?.role === Role.ADMIN && (
            <ActiveLink href="/admin/events">관리자</ActiveLink>
          )}
          {authenticated ? (
            <button
              className={linkClassName}
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              로그아웃
            </button>
          ) : (
            <button className="inline-flex" onClick={() => signIn('kakao')}>
              <Image
                src="/static/images/kakao_login_medium.png"
                alt=""
                width={90}
                height={45}
              />
            </button>
          )}
        </nav>
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
