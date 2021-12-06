import { forwardRef } from 'react';
import cx from 'classnames';
import { useRouter } from 'next/router';

export const linkClassName = 'block px-6 py-2 rounded-md hover:bg-gray-100';
export const activeClassName = '!bg-gray-900 text-white';

type ActiveLinkProps = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
> & {
  href: string;
};

const ActiveLink = forwardRef<HTMLAnchorElement, ActiveLinkProps>(function Link(
  { href, className, children, onClick, ...props },
  ref,
) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onClick?.(e);
    router.push(href);
  };

  const isCurrent =
    router.asPath === href || (href === '/' && router.route === '/events/[id]');

  return (
    <a
      href={href}
      onClick={handleClick}
      ref={ref}
      className={cx(linkClassName, className, isCurrent && activeClassName)}
      aria-current={isCurrent ? 'page' : undefined}
      {...props}
    >
      {children}
    </a>
  );
});

export default ActiveLink;
