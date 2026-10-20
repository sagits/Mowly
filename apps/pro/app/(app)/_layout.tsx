/** The signed-in shell: an Expo Router Drawer (left slide-in, or a permanent sidebar when wide), redirecting to welcome when signed out. */
import { Redirect } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { usePro } from '@mowly/api';
import { useSession } from '@mowly/stores';
import { colors, layout, useIsWide } from '@mowly/ui';
import { openSettingsCount } from '../../src/checklist';
import { BackButton } from '../../src/drawer/BackButton';
import { DrawerButton } from '../../src/drawer/DrawerButton';
import { DRAWER_ITEMS, DrawerMenu } from '../../src/drawer/DrawerMenu';

/** Layout for every signed-in screen. The pro track computes the real settings badge. */
export default function AppLayout() {
  const signedIn = useSession((s) => s.signedIn);
  const wide = useIsWide();
  const { data: pro } = usePro();
  if (!signedIn) return <Redirect href="/welcome" />;
  return (
    <Drawer
      drawerContent={(props) => <DrawerMenu {...props} settingsBadge={pro ? openSettingsCount(pro) : 0} />}
      backBehavior="history"
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
      {/* Pushed (app)-level screens: not drawer items, so a back button replaces the hamburger. */}
      <Drawer.Screen name="profile" options={{ headerShown: false }} />
      <Drawer.Screen name="evaluate" options={{ title: 'Evaluate your skills', headerLeft: () => <BackButton /> }} />
    </Drawer>
  );
}
