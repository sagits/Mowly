/** The green hamburger that opens the drawer from a drawer-root screen. */
import { Ionicons } from '@expo/vector-icons';
import type { DrawerNavigationProp } from 'expo-router/drawer';
import { useNavigation } from 'expo-router';
import { Pressable } from 'react-native';
import { colors, useIsWide } from '@mowly/ui';

/** `headerLeft` for drawer-root screens. Hidden when the drawer is a permanent sidebar. */
export function DrawerButton() {
  const wide = useIsWide();
  const navigation = useNavigation<DrawerNavigationProp<Record<string, undefined>>>();
  if (wide) return null;
  return (
    <Pressable
      testID="drawer-toggle"
      accessibilityRole="button"
      accessibilityLabel="Open menu"
      hitSlop={8}
      className="px-3"
      onPress={() => navigation.openDrawer()}
    >
      <Ionicons name="menu" size={28} color={colors.primary} />
    </Pressable>
  );
}
