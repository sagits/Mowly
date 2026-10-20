/** The signed-in tabs: a bottom bar on phones, a left sidebar on wide web. */
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { SwitchAppLink, TabBar, useIsWide } from '@mowly/ui';

type IconName = keyof typeof Ionicons.glyphMap;

const tabs: { name: string; title: string; icon: IconName; testID: string }[] = [
  { name: 'index', title: 'Browse', icon: 'storefront-outline', testID: 'tab-browse' },
  // The closest Ionicon to a calendar with a check.
  { name: 'services', title: 'Service', icon: 'calendar-outline', testID: 'tab-services' },
  { name: 'inbox', title: 'Inbox', icon: 'file-tray-outline', testID: 'tab-inbox' },
  { name: 'profile', title: 'Profile', icon: 'person-outline', testID: 'tab-profile' },
];

/** Tab layout. The web-only "Switch app" link sits in a strip above the tabs. */
export default function TabsLayout() {
  const wide = useIsWide();
  return (
    <View className="flex-1 bg-surface">
      <View className="items-end px-4">
        <SwitchAppLink />
      </View>
      <Tabs
        tabBar={(props) => <TabBar {...props} />}
        screenOptions={{ headerShown: false, tabBarPosition: wide ? 'left' : 'bottom' }}
      >
        {tabs.map(({ name, title, icon, testID }) => (
          <Tabs.Screen
            key={name}
            name={name}
            options={{
              title,
              tabBarButtonTestID: testID,
              tabBarIcon: ({ color, size }) => <Ionicons name={icon} color={color} size={size} />,
            }}
          />
        ))}
      </Tabs>
    </View>
  );
}
