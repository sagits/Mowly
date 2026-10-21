/** The pill button every call to action uses. */
import { Pressable, Text } from 'react-native';
import { Spinner } from './Spinner';

type Variant = 'filled' | 'outline' | 'orange' | 'text';

const GROUND: Record<Variant, string> = {
  filled: 'bg-primary',
  outline: 'border border-primary bg-surface',
  orange: 'bg-accent',
  text: '',
};
const INK: Record<Variant, string> = {
  filled: 'text-surface',
  outline: 'text-primary',
  orange: 'text-surface',
  text: 'text-primary',
};

/**
 * Full-width pill with an uppercase label. While `loading` it is a disabled gray button holding a `Spinner` (`${testID}-spinner`).
 * `size="sm"` is the compact pill of in-card actions (C18's VIEW PRICE and GET A QUOTE).
 */
export function Button({
  label,
  onPress,
  testID,
  variant = 'filled',
  disabled = false,
  loading = false,
  size = 'md',
}: {
  label: string;
  onPress: () => void;
  testID: string;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  size?: 'md' | 'sm';
}) {
  const inactive = disabled || loading;
  const ground = inactive && variant !== 'text' ? 'bg-surfaceMuted' : GROUND[variant];
  const ink = inactive ? 'text-legal' : INK[variant];

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={onPress}
      className={`w-full items-center justify-center rounded-full ${size === 'sm' ? 'px-4 py-2' : 'px-6 py-4'} ${ground}`}
    >
      {loading ? (
        <Spinner testID={`${testID}-spinner`} />
      ) : (
        <Text className={`${size === 'sm' ? 'text-sm font-semibold tracking-wide' : 'text-button'} uppercase ${ink}`}>{label}</Text>
      )}
    </Pressable>
  );
}
