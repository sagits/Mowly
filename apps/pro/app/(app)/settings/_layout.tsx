/** Stack for Settings: the list is the root (hamburger), pushed screens get the green native back button. */
import { Stack } from 'expo-router';
import { colors } from '@mowly/ui';
import { DrawerButton } from '../../../src/drawer/DrawerButton';

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerTintColor: colors.primary,
        headerTitleAlign: 'center',
        headerTitleStyle: { color: colors.primary },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Settings', headerLeft: () => <DrawerButton /> }} />
      <Stack.Screen name="work-area" options={{ title: 'Set up your work area', headerBackTitle: 'Back' }} />
    </Stack>
  );
}
