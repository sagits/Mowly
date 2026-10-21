/** A green pin on a CityMap, filled when selected: a price pill, or a small round numbered one (`variant="number"`). */
import { Pressable, Text } from 'react-native';

/** Placed at `x`/`y` (0..1) of the map; the pin is centred on that point. */
export function MapPin({ x, y, label, selected = false, variant = 'price', testID, onPress }: { x: number; y: number; label: string; selected?: boolean; variant?: 'price' | 'number'; testID?: string; onPress?: () => void }) {
  const number = variant === 'number';
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={{ left: `${x * 100}%`, top: `${y * 100}%`, transform: [{ translateX: number ? -14 : -30 }, { translateY: -14 }], zIndex: selected ? 1 : 0 }}
      className={`absolute items-center rounded-full border border-primary ${number ? 'h-7 w-7 justify-center' : 'w-[60px] py-1'} ${selected ? 'bg-primary' : 'bg-surface'}`}
    >
      <Text className={`text-xs font-semibold ${selected ? 'text-surface' : 'text-inkPro'}`}>{label}</Text>
    </Pressable>
  );
}
