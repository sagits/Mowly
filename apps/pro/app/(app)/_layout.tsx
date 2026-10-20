/** The signed-in shell: an Expo Router Drawer (left slide-in, or a permanent sidebar when wide), redirecting to welcome when signed out. */
import { Redirect } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { useSession } from '@mowly/stores';
import { colors, layout, useIsWide } from '@mowly/ui';
import { DrawerButton } from '../../src/drawer/DrawerButton';
import { DRAWER_ITEMS, DrawerMenu } from '../../src/drawer/DrawerMenu';

/** Layout for every signed-in screen. The pro track computes the real settings badge. */
export default function AppLayout() {
  const signedIn = useSession((s) => s.signedIn);
  const wide = useIsWide();
  if (!signedIn) return <Redirect href="/welcome" />;
  return (
    <Drawer
      drawerContent={(props) => <DrawerMenu {...props} settingsBadge={0} />}
      screenOptions={{
        drawerType: wide ? 'permanent' : 'front',
        drawerStyle: { width: layout.sidebarWidth },
        overlayColor: colors.scrim,
        headerTintColor: colors.primary,
        headerTitleAlign: 'center',
        headerTitleStyle: { color: colors.primary },
        headerLeft: () => <DrawerButton />,
      }}
    >
      {DRAWER_ITEMS.map((item) => (
        <Drawer.Screen
          key={item.testID}
          name={item.href === '/' ? 'index' : String(item.href).slice(1)}
          options={{ title: item.label }}
        />
      ))}
    </Drawer>
  );
}
