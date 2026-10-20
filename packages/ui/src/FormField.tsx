/** A labelled form field. */
import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { Text, TextInput, View, type TextInputProps } from 'react-native';
import { colors } from '../tokens';

/** One field: label, input and error line. Uses `Controller` because React Native has no DOM refs for `register`. */
export function FormField<TValues extends FieldValues>({
  control,
  name,
  testID,
  label,
  placeholder,
  multiline,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  autoCorrect,
}: {
  control: Control<TValues>;
  name: FieldPath<TValues>;
  testID: string;
  label: string;
  placeholder: string;
  multiline?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: TextInputProps['keyboardType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoCorrect?: boolean;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <View className="gap-2">
          <Text className="text-sm font-semibold text-ink">{label}</Text>
          <TextInput
            testID={testID}
            accessibilityLabel={label}
            value={(field.value as string | undefined) ?? ''}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            placeholder={placeholder}
            placeholderTextColor={colors.inkMuted}
            multiline={multiline}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            autoCorrect={autoCorrect}
            className={`rounded-card border bg-surface px-4 py-3 text-base text-ink ${
              fieldState.error ? 'border-danger' : 'border-border'
            } ${multiline ? 'h-28' : ''}`}
            style={multiline ? { textAlignVertical: 'top' } : undefined}
          />
          {fieldState.error ? (
            <Text testID={`${testID}-error`} className="text-sm leading-5 text-danger">
              {fieldState.error.message}
            </Text>
          ) : null}
        </View>
      )}
    />
  );
}
