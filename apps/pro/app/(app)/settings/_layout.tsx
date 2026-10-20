/** Stack for Settings: the list is the root (hamburger), pushed screens get the green native back button. */
import { Stack } from 'expo-router';
import { colors } from '@mowly/ui';
import { BackButton, leaveStep } from '../../../src/drawer/BackButton';
import { DrawerButton } from '../../../src/drawer/DrawerButton';

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerTintColor: colors.primary,
        headerTitleAlign: 'center',
        headerTitleStyle: { color: colors.primary },
              }}
    >
      <Stack.Screen name="index" options={{ title: 'Settings', headerLeft: () => <DrawerButton /> }} />
      <Stack.Screen name="work-area" options={{ title: 'Set up your work area', headerLeft: () => <BackButton onPress={leaveStep} /> }} />
      <Stack.Screen name="location" options={{ title: 'Turn on your GPS', headerLeft: () => <BackButton onPress={leaveStep} /> }} />
      <Stack.Screen name="damage-fee" options={{ title: 'Damage Fee', headerLeft: () => <BackButton onPress={leaveStep} /> }} />
    </Stack>
  );
}
