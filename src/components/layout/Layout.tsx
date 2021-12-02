import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import ActiveLink, { linkClassName } from '~/components/layout/ActiveLink';

const Layout: React.FC = ({ children }) => {
  const { status, data } = useSession();
  const authenticated = status === 'authenticated';

  return (
    <div className="container mx-auto px-4">
      <header className="py-10">
        <nav className="flex items-center text-lg font-medium">
          <ActiveLink href="/">행사</ActiveLink>
          <ActiveLink href="/shop" className="mr-auto">
            쇼핑몰
          </ActiveLink>
          {data?.isAdmin && <ActiveLink href="/admin">관리자</ActiveLink>}
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
    </div>
  );
};

export default Layout;
