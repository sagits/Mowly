/** Stack for the build-profile steps: the intro is the root, the form is pushed on top. */
import { Stack } from 'expo-router';
import { colors } from '@mowly/ui';
import { BackButton } from '../../../src/drawer/BackButton';

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerTintColor: colors.primary,
        headerTitleAlign: 'center',
        headerTitleStyle: { color: colors.primary },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: '', headerLeft: () => <BackButton /> }} />
      <Stack.Screen name="form" options={{ title: 'Build a profile', headerBackTitle: 'Back' }} />
    </Stack>
  );
}
