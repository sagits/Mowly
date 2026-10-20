/** The green back chevron for (app)-level screens that are not drawer items. */
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable } from 'react-native';
import { colors } from '@mowly/ui';

/**
 * Exit for Settings steps. The Settings stack keeps a step it was opened on from the Dashboard (back() there only
 * unwinds the drawer history), so back() from the next step would land on that stale one. Jump to the Dashboard instead.
 */
export const leaveStep = () => router.navigate('/');

export function BackButton({ onPress = () => router.back() }: { onPress?: () => void }) {
  return (
    <Pressable testID="back-button" accessibilityRole="button" accessibilityLabel="Back" hitSlop={8} className="px-3" onPress={onPress}>
      <Ionicons name="chevron-back" size={28} color={colors.primary} />
    </Pressable>
  );
}
