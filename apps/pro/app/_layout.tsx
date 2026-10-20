/** The root layout: loads the NativeWind stylesheet and wraps the navigation Stack in the app providers. */
import { Stack } from 'expo-router';
import { AppProviders } from '@mowly/features';
import { configureMocks } from '@mowly/mocks';
import { colors } from '@mowly/ui';
import '../global.css';

configureMocks({ seed: process.env.EXPO_PUBLIC_SEED !== 'false' });

/** The root layout of the app. */
export default function RootLayout() {
  return (
    <AppProviders>
      <Stack
        screenOptions={{
          headerTintColor: colors.primary,
          headerTitleAlign: 'center',
          headerTitleStyle: { color: colors.primary },
        }}
      >
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
      </Stack>
    </AppProviders>
  );
}
