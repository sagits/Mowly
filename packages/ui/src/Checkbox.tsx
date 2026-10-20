/** A checkbox with an optional label. */
import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors } from '../tokens';

/** Square box with a check when `checked`; pressing reports the opposite value. `label` may be rich (inline links). */
export function Checkbox({
  checked,
  onChange,
  testID,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  testID: string;
  label?: ReactNode;
}) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={() => onChange(!checked)}
      className="flex-row items-center gap-3"
    >
      <View
        className={`h-6 w-6 items-center justify-center rounded-field border ${
          checked ? 'border-primary bg-primary' : 'border-border bg-surface'
        }`}
      >
        {checked ? <Ionicons name="checkmark" size={18} color={colors.surface} /> : null}
      </View>
      {typeof label === 'string' ? <Text className="flex-1 text-body-lg text-ink">{label}</Text> : label}
    </Pressable>
  );
}
