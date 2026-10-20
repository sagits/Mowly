/** An on/off switch with an optional label. */
import { Switch, Text, View } from 'react-native';
import { colors } from '../tokens';

/** Wraps `Switch` with a `primary` track. */
export function Toggle({
  value,
  onValueChange,
  testID,
  label,
}: {
  value: boolean;
  onValueChange: (value: boolean) => void;
  testID: string;
  label?: string;
}) {
  return (
    <View className="flex-row items-center justify-between gap-3">
      {label ? <Text className="flex-1 text-body-lg text-ink">{label}</Text> : null}
      <Switch
        testID={testID}
        accessibilityRole="switch"
        accessibilityLabel={label}
        accessibilityState={{ checked: value }}
        value={value}
        onValueChange={onValueChange}
        trackColor={{ true: colors.primary, false: colors.surfaceMuted }}
        thumbColor={colors.surface}
      />
    </View>
  );
}
