/** The pro app's navigation menu: a sliding modal on narrow screens, a permanent sidebar on wide ones. */
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname, type Href } from 'expo-router';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { usePro } from '@mowly/api';
import { Badge, colors, ListRow, SwitchAppLink, useIsWide } from '@mowly/ui';
import { useDrawer } from './useDrawer';

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

function Items({ settingsBadge, onNavigate }: { settingsBadge: number; onNavigate: () => void }) {
  const { data: pro } = usePro();
  const pathname = usePathname();
  const name = pro ? `${pro.firstName} ${pro.lastName}`.toUpperCase() : '';
  return (
    <ScrollView className="flex-1 bg-surface" contentContainerClassName="pt-16 md:pt-6">
      <Text testID="drawer-name" className="px-4 pb-4 text-lg font-bold text-primary">{name}</Text>
      {DRAWER_ITEMS.map((item) => {
        const active = item.href === '/' ? pathname === '/' : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <ListRow
            key={item.testID}
            testID={item.testID}
            title={item.label}
            chevron={false}
            left={<Ionicons name={item.icon} size={24} color={active ? colors.primary : colors.muted} />}
            right={item.testID === 'drawer-settings' && settingsBadge > 0 ? <Badge testID="drawer-settings-badge" label={String(settingsBadge)} /> : undefined}
            onPress={() => {
              onNavigate();
              router.navigate(item.href);
            }}
          />
        );
      })}
      <View className="items-center py-4"><SwitchAppLink /></View>
    </ScrollView>
  );
}

/** The drawer. `settingsBadge` is the count of open settings items; the badge hides at 0. */
export function DrawerMenu({ settingsBadge }: { settingsBadge: number }) {
  const wide = useIsWide();
  const { open, setOpen } = useDrawer();
  if (wide) {
    return (
      <View testID="drawer-sidebar" className="w-sidebar border-r border-border">
        <Items settingsBadge={settingsBadge} onNavigate={() => {}} />
      </View>
    );
  }
  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
      <View className="flex-1 flex-row">
        <View className="w-sidebar bg-surface">
          <Items settingsBadge={settingsBadge} onNavigate={() => setOpen(false)} />
        </View>
        <Pressable testID="drawer-scrim" accessibilityLabel="Close menu" className="flex-1 bg-scrim" onPress={() => setOpen(false)} />
      </View>
    </Modal>
  );
}
