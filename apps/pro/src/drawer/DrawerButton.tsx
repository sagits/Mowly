/** The green hamburger that opens the drawer from a drawer-root screen. */
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { colors, useIsWide } from '@mowly/ui';
import { useDrawer } from './useDrawer';

/** `headerLeft` for drawer-root screens. Hidden when the drawer is a permanent sidebar. */
export function DrawerButton() {
  const wide = useIsWide();
  const setOpen = useDrawer((s) => s.setOpen);
  if (wide) return null;
  return (
    <Pressable testID="drawer-toggle" accessibilityRole="button" accessibilityLabel="Open menu" hitSlop={8} onPress={() => setOpen(true)}>
      <Ionicons name="menu" size={28} color={colors.primary} />
    </Pressable>
  );
}
