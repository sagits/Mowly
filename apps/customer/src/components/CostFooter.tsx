/** Sticky footer of the quote funnel: cost per service, the fee line and the CTA (C09). */
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@mowly/ui';
import { formatPrice, TRUST_FEE } from '../pricing';

/** `price` is the per-service cost in dollars. */
export function CostFooter({
  price,
  cta,
  onPress,
  disabled,
  loading,
  testID,
}: {
  price: number;
  cta: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  testID: string;
}) {
  const { bottom } = useSafeAreaInsets();
  return (
    <View className="border-t border-border bg-surface px-4 pt-4" style={{ paddingBottom: bottom + 12 }}>
      <View className="flex-row items-center justify-between">
        <Text className="text-xl font-bold text-ink">Cost per service</Text>
        <Text testID="cost-per-service" className="text-xl font-bold text-ink">{formatPrice(price)}</Text>
      </View>
      <Text className="mb-4 mt-1 text-base text-fee">{`+ ${formatPrice(TRUST_FEE)} Trust & Safety Fee`}</Text>
      <Button testID={testID} label={cta} onPress={onPress} disabled={disabled} loading={loading} />
    </View>
  );
}
