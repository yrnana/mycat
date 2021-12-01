import Link from 'next/link';

const Layout: React.FC = ({ children }) => {
  return (
    <div className="container mx-auto px-4">
      <header className="py-10">
        <nav className="flex space-x-2 text-lg font-medium">
          <Link href="/">
            <a className="block px-5 py-2 bg-sky-100 rounded">행사</a>
          </Link>
          <Link href="/shop">
            <a className="block px-5 py-2 rounded">쇼핑몰</a>
          </Link>
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
