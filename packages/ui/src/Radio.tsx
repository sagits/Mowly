/** A radio option. */
import { Pressable, Text, View } from 'react-native';

/** Round dot plus label; the parent owns which option is `selected`. */
export function Radio({
  selected,
  onPress,
  testID,
  label,
}: {
  selected: boolean;
  onPress: () => void;
  testID: string;
  label: string;
}) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      className="flex-row items-center gap-3"
    >
      <View
        className={`h-6 w-6 items-center justify-center rounded-full border-2 ${
          selected ? 'border-primary' : 'border-border'
        }`}
      >
        {selected ? <View className="h-3 w-3 rounded-full bg-primary" /> : null}
      </View>
      <Text className="text-body-lg text-ink">{label}</Text>
    </Pressable>
  );
}
