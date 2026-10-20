/** A tappable list row with a title, optional parts and a green chevron. */
import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors } from '../tokens';
import { Badge } from './Badge';

/** Settings-style row. `disabled` grays the text and chevron and ignores presses. */
export function ListRow({
  title,
  testID,
  subtitle,
  left,
  right,
  onPress,
  disabled = false,
  chevron = true,
  badge,
}: {
  title: string;
  testID: string;
  subtitle?: string;
  left?: ReactNode;
  right?: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  chevron?: boolean;
  badge?: string;
}) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      className="flex-row items-center border-b border-border px-4 py-4"
      onPress={disabled ? undefined : onPress}
    >
      {left ? <View className="mr-3">{left}</View> : null}
      <View className="flex-1">
        <Text className={`text-base ${disabled ? 'text-disabled' : 'text-ink'}`}>{title}</Text>
        {subtitle ? <Text className={`mt-0.5 text-sm ${disabled ? 'text-disabled' : 'text-muted'}`}>{subtitle}</Text> : null}
      </View>
      {badge ? <Badge label={badge} /> : null}
      {right ? <View className="ml-3">{right}</View> : null}
      {chevron ? (
        <Ionicons name="chevron-forward" size={20} color={disabled ? colors.disabled : colors.primary} style={{ marginLeft: 8 }} />
      ) : null}
    </Pressable>
  );
}
