import { forwardRef } from 'react';
import cx from 'classnames';

const buttonClassName =
  'inline-flex items-center justify-center focus:outline-none min-w-28 py-2 rounded-md font-semibold';

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  color?: 'primary' | 'secondary';
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function CustomInput(
  { color = 'primary', className, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cx(
        buttonClassName,
        color === 'primary'
          ? 'text-white bg-sky-400 hover:bg-sky-500 focus:ring-4 focus:ring-sky-200'
          : 'text-white bg-gray-400 hover:bg-gray-500 focus:ring-4 focus:ring-gray-200',
        className,
        props.disabled && '!cursor-not-allowed',
        props.disabled &&
          (color === 'primary'
            ? 'bg-sky-200 hover:bg-sky-200'
            : 'bg-gray-200 hover:bg-gray-200'),
      )}
      {...props}
    />
  );
});

export default Button;
