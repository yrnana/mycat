import { format, isValid, parse } from 'date-fns';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { useController } from 'react-hook-form';
import Input, { InputProps } from './Input';

export interface DateTimeInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends InputProps {
  name: TName;
  control: Control<TFieldValues>;
}

export default function DateTimeInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ name, control, ref, ...props }: DateTimeInputProps<TFieldValues, TName>) {
  const {
    field: { value, onChange, ...field },
  } = useController({
    name,
    control,
  });

  return (
    <Input
      type="datetime-local"
      {...props}
      {...field}
      value={isValid(value) ? format(value, `yyyy-MM-dd'T'HH:mm`) : ''}
      onChange={(e) => {
        onChange(parse(e.target.value, `yyyy-MM-dd'T'HH:mm`, new Date()));
      }}
    />
  );
}
