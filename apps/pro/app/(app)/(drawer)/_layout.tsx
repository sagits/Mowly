/** The drawer: one screen per drawer item (left slide-in at every width, web included), each with the hamburger. */
import { Drawer } from 'expo-router/drawer';
import { usePro } from '@mowly/api';
import { colors, layout } from '@mowly/ui';
import { openSettingsCount } from '../../../src/checklist';
import { DrawerButton } from '../../../src/drawer/DrawerButton';
import { DRAWER_ITEMS, DrawerMenu } from '../../../src/drawer/DrawerMenu';

/** Layout for the drawer roots. Pushed screens live in the parent Stack, above the drawer. */
export default function DrawerLayout() {
  const { data: pro } = usePro();
  return (
    <Drawer
      drawerContent={(props) => <DrawerMenu {...props} settingsBadge={pro ? openSettingsCount(pro) : 0} />}
      screenOptions={{
        drawerType: 'front',
        drawerStyle: { width: layout.sidebarWidth },
        overlayColor: colors.scrim,
        headerTintColor: colors.primary,
        headerTitleAlign: 'center',
        headerTitleStyle: { color: colors.primary },
        headerLeft: () => <DrawerButton />,
      }}
    >
      {DRAWER_ITEMS.map((item) => (
        <Drawer.Screen key={item.testID} name={item.href === '/' ? 'index' : String(item.href).slice(1)} options={{ title: item.label }} />
      ))}
    </Drawer>
  );
}
