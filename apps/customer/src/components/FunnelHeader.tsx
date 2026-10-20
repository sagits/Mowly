/** The header of every quote funnel screen: wordmark, phone icon and the street address. */
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCustomer } from '@mowly/api';
import { colors, Wordmark } from '@mowly/ui';
import { useQuoteDraft } from '../stores/useQuoteDraft';

/** Draft address when the contact step is done, the customer's address before that. */
export function FunnelHeader() {
  const contact = useQuoteDraft((s) => s.contact);
  const { data: customer } = useCustomer();
  const { top } = useSafeAreaInsets();
  const address = contact?.addressText ?? customer?.address.line1 ?? '';

  return (
    <View className="px-4" style={{ paddingTop: top + 8 }}>
      <View className="flex-row items-center justify-between">
        <Wordmark />
        <View className="h-10 w-10 items-center justify-center rounded-full border border-border">
          <Ionicons name="call" size={22} color={colors.primary} />
        </View>
      </View>
      <View testID="funnel-address" className="mt-3 flex-row items-center border-b border-border pb-3">
        <Ionicons name="home-outline" size={22} color={colors.ink} />
        <Text className="ml-2 text-base text-ink">{address}</Text>
      </View>
    </View>
  );
}
