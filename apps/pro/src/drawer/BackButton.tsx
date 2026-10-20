/** The green back chevron for (app)-level screens that are not drawer items. */
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable } from 'react-native';
import { colors } from '@mowly/ui';

export function BackButton() {
  return (
    <Pressable testID="back-button" accessibilityRole="button" accessibilityLabel="Back" hitSlop={8} className="px-3" onPress={() => router.back()}>
      <Ionicons name="chevron-back" size={28} color={colors.primary} />
    </Pressable>
  );
}
