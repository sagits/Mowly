// Bottom sheet behind the header's address chevron (C18).
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { BottomSheet, colors } from '@mowly/ui';

/**
 * Lists the customer's one address and "Add address" (testid `address-switcher-add`), which opens the quote form in
 * address-only mode to replace it: the customer keeps one address. Testid `address-switcher-sheet`.
 */
export function AddressSwitcher({ visible, onClose, line1 }: { visible: boolean; onClose: () => void; line1: string }) {
  const router = useRouter();
  return (
    <BottomSheet visible={visible} onClose={onClose} testID="address-switcher-sheet" title="Your addresses">
      <View className="flex-row items-center gap-3 py-3">
        <Ionicons name="home" size={22} color={colors.primary} />
        <Text className="flex-1 text-base text-ink">{line1}</Text>
        <Ionicons name="checkmark" size={22} color={colors.primary} />
      </View>
      <Pressable
        testID="address-switcher-add"
        accessibilityRole="button"
        className="flex-row items-center gap-3 py-3"
        onPress={() => {
          onClose();
          router.push('/quote/details?address=1');
        }}
      >
        <Ionicons name="add-circle-outline" size={22} color={colors.link} />
        <Text className="text-base text-link">Add address</Text>
      </Pressable>
    </BottomSheet>
  );
}
