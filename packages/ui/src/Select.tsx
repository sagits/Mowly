/** A dropdown field that picks one option from a bottom sheet. */
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors } from '../tokens';
import { BottomSheet } from './BottomSheet';

/** Shows the chosen label (or `placeholder`); the sheet lists `options` as `${testID}-option-${value}`. */
export function Select<V extends string>({
  label,
  value,
  options,
  onChange,
  testID,
  placeholder = 'Select',
}: {
  label: string;
  value: V | undefined;
  options: { value: V; label: string }[];
  onChange: (value: V) => void;
  testID: string;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const chosen = options.find((o) => o.value === value);
  return (
    <View>
      <Text className="mb-1 text-sm font-semibold text-inkSoft">{label}</Text>
      <Pressable
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={label}
        className="flex-row items-center justify-between rounded-field border border-border bg-surface px-3 py-3"
        onPress={() => setOpen(true)}
      >
        <Text className={`text-base ${chosen ? 'text-ink' : 'text-placeholder'}`}>{chosen?.label ?? placeholder}</Text>
        <Ionicons name="chevron-down" size={18} color={colors.muted} />
      </Pressable>
      <BottomSheet visible={open} onClose={() => setOpen(false)} title={label} testID={`${testID}-sheet`}>
        {options.map((o) => (
          <Pressable
            key={o.value}
            testID={`${testID}-option-${o.value}`}
            accessibilityRole="button"
            className="flex-row items-center justify-between border-b border-border py-3"
            onPress={() => {
              onChange(o.value);
              setOpen(false);
            }}
          >
            <Text className="text-base text-ink">{o.label}</Text>
            {o.value === value ? <Ionicons name="checkmark" size={20} color={colors.primary} /> : null}
          </Pressable>
        ))}
      </BottomSheet>
    </View>
  );
}
