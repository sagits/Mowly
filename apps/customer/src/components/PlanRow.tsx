/** One frequency option: label left, price block right, optional "Recommended" tab (C09). */
import { Pressable, Text, View } from 'react-native';
import { FREQUENCY_LABELS, type PlanOption } from '@mowly/types';

/** Selected is a green price block on a tint; unselected is gray. */
export function PlanRow({
  plan,
  selected,
  onPress,
  testID,
}: {
  plan: PlanOption;
  selected: boolean;
  onPress: () => void;
  testID: string;
}) {
  return (
    <View>
      {plan.recommended && (
        <View className="self-start rounded-t-field bg-primary px-5 py-2">
          <Text className="text-base text-surface">Recommended</Text>
        </View>
      )}
      <Pressable
        testID={testID}
        accessibilityRole="radio"
        accessibilityState={{ selected }}
        onPress={onPress}
        className={`h-[66px] flex-row overflow-hidden rounded-card ${selected ? 'border-2 border-primary bg-primaryTint' : 'bg-surfaceMuted'}`}
      >
        <View className="flex-1 justify-center px-5">
          <Text className="text-xl font-semibold text-ink">{FREQUENCY_LABELS[plan.frequency]}</Text>
        </View>
        <View className={`w-[36%] items-end justify-center px-4 ${selected ? 'bg-primary' : 'bg-priceBlock'}`}>
          <Text className="text-3xl font-bold text-surface">{`$${plan.price}`}</Text>
          <Text className="text-sm text-surface">per service</Text>
        </View>
      </Pressable>
    </View>
  );
}
