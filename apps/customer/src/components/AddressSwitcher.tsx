// Bottom sheet behind the header's address chevron (C18).
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { BottomSheet, colors } from '@mowly/ui';

/** Lists the customer's one address and an inert "Add address". Testid `address-switcher-sheet`. */
export function AddressSwitcher({ visible, onClose, line1 }: { visible: boolean; onClose: () => void; line1: string }) {
  return (
    <BottomSheet visible={visible} onClose={onClose} testID="address-switcher-sheet" title="Your addresses">
      <View className="flex-row items-center gap-3 py-3">
        <Ionicons name="home" size={22} color={colors.primary} />
        <Text className="flex-1 text-base text-ink">{line1}</Text>
        <Ionicons name="checkmark" size={22} color={colors.primary} />
      </View>
      <View className="flex-row items-center gap-3 py-3">
        <Ionicons name="add-circle-outline" size={22} color={colors.link} />
        <Text className="text-base text-link">Add address</Text>
      </View>
    </BottomSheet>
  );
}
