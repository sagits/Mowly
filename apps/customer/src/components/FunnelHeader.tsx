/** The header of every quote funnel screen: wordmark, phone icon and the street address. */
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCustomer } from '@mowly/api';
import { colors, Wordmark } from '@mowly/ui';
import { useQuoteDraft } from '../stores/useQuoteDraft';

/**
 * Leaves the funnel and keeps the draft. It closes the quote modal on the root stack, so it returns to whichever
 * tab opened it; with nothing under the modal (a web reload or a deep link) it replaces to Browse.
 */
export function useCloseFunnel() {
  const navigation = useNavigation();
  const router = useRouter();
  return () => {
    const root = navigation.getParent();
    if (root?.canGoBack()) root.goBack();
    else router.replace('/');
  };
}

/** The X that leaves the funnel (testid `funnel-close`), see `useCloseFunnel`. */
export function FunnelClose({ color = colors.ink }: { color?: string }) {
  const close = useCloseFunnel();
  return (
    <Pressable testID="funnel-close" accessibilityRole="button" accessibilityLabel="Close" hitSlop={8} onPress={close}>
      <Ionicons name="close" size={28} color={color} />
    </Pressable>
  );
}

/**
 * Draft address when the contact step is done, the customer's address before that. With `editAddress` a pencil
 * (testid `funnel-edit-address`) goes back to the form, popping to it when it is under this screen.
 */
export function FunnelHeader({ editAddress = false }: { editAddress?: boolean }) {
  const router = useRouter();
  const contact = useQuoteDraft((s) => s.contact);
  const { data: customer } = useCustomer();
  const { top } = useSafeAreaInsets();
  const address = contact?.addressText ?? customer?.address.line1 ?? '';

  return (
    <View className="px-4" style={{ paddingTop: top + 8 }}>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <FunnelClose />
          <Wordmark />
        </View>
        <View className="h-10 w-10 items-center justify-center rounded-full border border-border">
          <Ionicons name="call" size={22} color={colors.primary} />
        </View>
      </View>
      <View testID="funnel-address" className="mt-3 flex-row items-center border-b border-border pb-3">
        <Ionicons name="home-outline" size={22} color={colors.ink} />
        <Text className="ml-2 flex-1 text-base text-ink">{address}</Text>
        {editAddress ? (
          <Pressable
            testID="funnel-edit-address"
            accessibilityRole="button"
            accessibilityLabel="Change address"
            hitSlop={8}
            onPress={() => router.dismissTo('/quote/details')}
          >
            <Ionicons name="create-outline" size={22} color={colors.primary} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
