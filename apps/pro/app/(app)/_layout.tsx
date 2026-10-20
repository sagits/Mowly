/** The signed-in shell: a native Stack whose first screen is the drawer; step screens push above it. Redirects to welcome when signed out. */
import { Redirect, Stack } from 'expo-router';
import { useSession } from '@mowly/stores';
import { colors } from '@mowly/ui';

/** Layout for every signed-in screen. Pushed screens get the native back button, tinted green. */
export default function AppLayout() {
  const signedIn = useSession((s) => s.signedIn);
  if (!signedIn) return <Redirect href="/welcome" />;
  return (
    <Stack
      screenOptions={{
        headerTintColor: colors.primary,
        headerTitleAlign: 'center',
        headerTitleStyle: { color: colors.primary },
        // Chevron only: the previous title would read "(drawer)", the group's route name.
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      <Stack.Screen name="profile/index" options={{ title: '', headerShadowVisible: false }} />
      <Stack.Screen name="profile/form" options={{ title: 'Build a profile', headerBackTitle: 'Back', headerBackButtonDisplayMode: 'default', headerShadowVisible: false }} />
      <Stack.Screen name="evaluate" options={{ title: 'Evaluate your skills' }} />
      <Stack.Screen name="settings/work-area" options={{ title: 'Set up your work area' }} />
      <Stack.Screen name="settings/location" options={{ title: 'Turn on your GPS' }} />
      <Stack.Screen name="settings/damage-fee" options={{ title: 'Damage Fee' }} />
    </Stack>
  );
}
