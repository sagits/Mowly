/** A React Hook Form field. */
import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { TextField } from './TextField';

type TextFieldProps = Parameters<typeof TextField>[0];

/** `TextField` bound to a form value with `Controller`, since React Native has no DOM refs for `register`. */
export function FormField<TValues extends FieldValues>({
  control,
  name,
  onBlur,
  ...field
}: Omit<TextFieldProps, 'value' | 'onChangeText' | 'error'> & {
  control: Control<TValues>;
  name: FieldPath<TValues>;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: bound, fieldState }) => (
        <TextField
          {...field}
          value={(bound.value as string | undefined) ?? ''}
          onChangeText={bound.onChange}
          onBlur={() => {
            bound.onBlur();
            onBlur?.();
          }}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}
