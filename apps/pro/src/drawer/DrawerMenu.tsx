/** The pro app's drawer items and the `drawerContent` the Expo Router Drawer renders. */
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname, type Href } from 'expo-router';
import { useDrawerStatus, type DrawerContentComponentProps } from 'expo-router/drawer';
import { Platform, ScrollView, Text, View } from 'react-native';
import { usePro } from '@mowly/api';
import { Badge, colors, ListRow, SwitchAppLink } from '@mowly/ui';

type IoniconName = keyof typeof Ionicons.glyphMap;

/** Every drawer destination, in PRD order. */
export const DRAWER_ITEMS: { href: Href; label: string; icon: IoniconName; testID: string }[] = [
  { href: '/', label: 'Dashboard', icon: 'grid-outline', testID: 'drawer-dashboard' },
  { href: '/jobs', label: 'Available Jobs', icon: 'briefcase-outline', testID: 'drawer-jobs' },
  { href: '/skills', label: 'Skills and Services', icon: 'construct-outline', testID: 'drawer-skills' },
  { href: '/calendar', label: 'Calendar', icon: 'calendar-outline', testID: 'drawer-calendar' },
  { href: '/crews', label: 'Crews', icon: 'people-outline', testID: 'drawer-crews' },
  { href: '/inbox', label: 'Inbox', icon: 'mail-outline', testID: 'drawer-inbox' },
  { href: '/customers', label: 'Customer Search', icon: 'search-outline', testID: 'drawer-customers' },
  { href: '/performance', label: 'Performance', icon: 'stats-chart-outline', testID: 'drawer-performance' },
  { href: '/support', label: 'Support', icon: 'help-circle-outline', testID: 'drawer-support' },
  { href: '/settings', label: 'Settings', icon: 'settings-outline', testID: 'drawer-settings' },
];

/**
 * The drawer's content: the pro's name, one row per destination and the app switch link.
 * `settingsBadge` is the count of open settings items; the badge hides at 0.
 * Tapping a row navigates and closes the drawer.
 * On web the closed drawer still sits in the DOM off-screen, so its rows leave the tab order and the
 * screen-reader tree until it opens.
 */
export function DrawerMenu({ navigation, settingsBadge }: DrawerContentComponentProps & { settingsBadge: number }) {
  const { data: pro } = usePro();
  const pathname = usePathname();
  const name = pro ? `${pro.firstName} ${pro.lastName}`.toUpperCase() : '';
  const status = useDrawerStatus();
  const offscreen = Platform.OS === 'web' && status === 'closed';
  return (
    <ScrollView testID="drawer-sidebar" aria-hidden={offscreen || undefined} className="flex-1 bg-surface" contentContainerClassName="pt-16">
      <Text testID="drawer-name" className="px-4 pb-4 text-lg font-bold text-primary">{name}</Text>
      {DRAWER_ITEMS.map((item) => {
        const active = item.href === '/' ? pathname === '/' : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <ListRow
            key={item.testID}
            testID={item.testID}
            title={item.label}
            chevron={false}
            focusable={!offscreen}
            left={<Ionicons name={item.icon} size={24} color={active ? colors.primary : colors.muted} />}
            right={item.testID === 'drawer-settings' && settingsBadge > 0 ? <Badge testID="drawer-settings-badge" label={String(settingsBadge)} /> : undefined}
            onPress={() => {
              // the closing drawer turns aria-hidden, which the browser refuses while a row inside it keeps focus
              if (Platform.OS === 'web') (document.activeElement as HTMLElement | null)?.blur();
              navigation.closeDrawer();
              router.navigate(item.href);
            }}
          />
        );
      })}
      <View className="items-center py-4"><SwitchAppLink to="customer" focusable={!offscreen} /></View>
    </ScrollView>
  );
}
