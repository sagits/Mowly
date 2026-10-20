/** The labelled text input every form uses. */
import { useState, type ReactNode } from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';
import { colors } from '../tokens';

/** Label above a white input that turns green border while focused; `error` shows below (`${testID}-error`). `right` sits inside the input's right edge. */
export function TextField({
  label,
  value,
  onChangeText,
  testID,
  placeholder,
  error,
  secureTextEntry,
  keyboardType,
  multiline,
  maxLength,
  editable = true,
  right,
  onFocus,
  onBlur,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  testID: string;
  placeholder?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: TextInputProps['keyboardType'];
  multiline?: boolean;
  maxLength?: number;
  editable?: boolean;
  right?: ReactNode;
  onFocus?: () => void;
  onBlur?: () => void;
}) {
  const [focused, setFocused] = useState(false);
  const border = error ? 'border-danger' : focused ? 'border-primary' : 'border-border';

  return (
    <View className="gap-2">
      <Text className="text-label text-ink">{label}</Text>
      <View className={`flex-row items-center rounded-field border bg-surface px-3 ${border}`}>
        <TextInput
          testID={testID}
          accessibilityLabel={label}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => {
            setFocused(true);
            onFocus?.();
          }}
          onBlur={() => {
            setFocused(false);
            onBlur?.();
          }}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          maxLength={maxLength}
          editable={editable}
          className={`flex-1 py-3 text-body-lg text-ink ${multiline ? 'h-28' : ''}`}
          style={multiline ? { textAlignVertical: 'top' } : undefined}
        />
        {right}
      </View>
      {error ? (
        <Text testID={`${testID}-error`} className="text-caption text-danger">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
