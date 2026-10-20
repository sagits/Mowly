/** The tab bar for Expo Router `Tabs`: a bottom row on phones, a sidebar column when wide. */
// Deep type-only import: expo-router does not re-export BottomTabBarProps.
import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs';
import { Pressable, Text, View } from 'react-native';
import { colors, layout } from '../tokens';
import { useIsWide } from './useIsWide';

/** Pass as `tabBar` to `Tabs`. Each screen supplies `title` and an Ionicons `tabBarIcon`; testID is `tab-<route>` unless `tabBarButtonTestID` is set. */
export function TabBar({ state, descriptors, navigation, insets }: BottomTabBarProps) {
  const wide = useIsWide();
  return (
    <View
      accessibilityRole="tablist"
      style={wide ? { width: layout.sidebarWidth } : { paddingBottom: insets.bottom }}
      className={wide ? 'border-r border-border bg-surface pt-6' : 'flex-row border-t border-border bg-surface pt-2'}
    >
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const options = descriptors[route.key]?.options;
        const color = focused ? colors.primary : colors.disabled;
        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
        };
        return (
          <Pressable
            key={route.key}
            testID={options?.tabBarButtonTestID ?? `tab-${route.name}`}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            className={wide ? 'flex-row items-center gap-3 px-6 py-3' : 'flex-1 items-center pb-1'}
            onPress={onPress}
          >
            {options?.tabBarIcon?.({ focused, color, size: 24 })}
            <Text style={{ color }} className={wide ? 'text-base font-semibold' : 'mt-0.5 text-caption font-semibold'}>
              {options?.title ?? route.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
