import { forwardRef } from 'react';
import cx from 'classnames';

export const inputClassName =
  'max-w-full px-4 py-3 leading-5 border rounded-md focus:outline-none focus:ring-2 focus:border-sky-400 placeholder-gray-300';

export type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  icon?: React.ReactNode;
  onClickIcon?: React.MouseEventHandler<HTMLButtonElement>;
};

const Input = forwardRef<HTMLInputElement, InputProps>(function CustomInput(
  { icon, onClickIcon, className, id, name, ...props },
  ref,
) {
  return (
    <div className="relative inline-flex items-center max-w-full">
      <input
        ref={ref}
        name={name}
        id={id ?? name}
        className={cx(inputClassName, className, icon && `pr-12`)}
        {...props}
      />
      {icon && (
        <button
          type="button"
          className="absolute z-10 right-4 text-gray-500"
          onClick={onClickIcon}
        >
          {icon}
        </button>
      )}
    </div>
  );
});

export default Input;

type LabelProps = React.DetailedHTMLProps<
  React.LabelHTMLAttributes<HTMLLabelElement>,
  HTMLLabelElement
> & {
  required?: boolean;
};

export const Label = ({
  required,
  className,
  children,
  ...props
}: LabelProps) => {
  // eslint-disable-next-line jsx-a11y/label-has-associated-control
  return (
    <label className={cx('block mb-2 font-medium', className)} {...props}>
      {required && <span className="text-red-400 mr-2">*</span>}
      <span>{children}</span>
    </label>
  );
};

type FormControlProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  nested?: boolean;
};

export const FormControl = ({
  nested,
  className,
  ...props
}: FormControlProps) => {
  return (
    <div
      className={cx(
        'flex flex-col items-start',
        nested ? 'mb-4' : 'mb-8',
        className,
      )}
      {...props}
    />
  );
};
