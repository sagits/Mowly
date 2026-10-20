/** The signed-in shell: drawer menu beside a native Stack, with a redirect to welcome when signed out. */
import { Redirect, Stack } from 'expo-router';
import { View } from 'react-native';
import { useSession } from '@mowly/stores';
import { colors } from '@mowly/ui';
import { DrawerButton } from '../../src/drawer/DrawerButton';
import { DRAWER_ITEMS, DrawerMenu } from '../../src/drawer/DrawerMenu';

/** Layout for every signed-in screen. The pro track computes the real settings badge. */
export default function AppLayout() {
  const signedIn = useSession((s) => s.signedIn);
  if (!signedIn) return <Redirect href="/welcome" />;
  return (
    <View className="flex-1 flex-row">
      <DrawerMenu settingsBadge={0} />
      <View className="flex-1">
        <Stack
          screenOptions={{
            headerTintColor: colors.primary,
            headerTitleAlign: 'center',
            headerTitleStyle: { color: colors.primary },
          }}
        >
          {DRAWER_ITEMS.map((item) => (
            <Stack.Screen
              key={item.testID}
              name={item.href === '/' ? 'index' : String(item.href).slice(1)}
              options={{ title: item.label, headerLeft: () => <DrawerButton /> }}
            />
          ))}
        </Stack>
      </View>
    </View>
  );
}
