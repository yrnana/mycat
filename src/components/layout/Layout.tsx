import cx from 'classnames';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

const linkClassName = 'block px-6 py-2 rounded';

const Layout: React.FC = ({ children }) => {
  const { status } = useSession();
  const authenticated = status === 'authenticated';

  return (
    <div className="container mx-auto px-4">
      <header className="py-10">
        <nav className="flex items-center text-lg font-medium">
          <Link href="/">
            <a className={cx(linkClassName, 'bg-sky-100')}>행사</a>
          </Link>
          <Link href="/shop">
            <a className={cx(linkClassName, 'mr-auto')}>쇼핑몰</a>
          </Link>
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
