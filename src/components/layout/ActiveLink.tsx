import { forwardRef } from 'react';
import cx from 'classnames';
import { useRouter } from 'next/router';

export const linkClassName = 'block px-6 py-2 rounded';
export const activeClassName = 'bg-sky-100';

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

  return (
    <a
      href={href}
      onClick={handleClick}
      ref={ref}
      className={cx(
        className,
        linkClassName,
        (router.asPath === href ||
          (href === '/' && router.route === '/events/[id]')) &&
          activeClassName,
      )}
      {...props}
    >
      {children}
    </a>
  );
});

export default ActiveLink;
