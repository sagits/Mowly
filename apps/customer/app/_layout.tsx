/** The root layout: loads the NativeWind stylesheet and wraps the navigation Stack in the app providers. */
import { Stack } from 'expo-router';
import Head from 'expo-router/head';
import { Platform } from 'react-native';
import { AppProviders } from '@mowly/features';
import { configureMocks } from '@mowly/mocks';
import { colors } from '@mowly/ui';
import '../global.css';

configureMocks({ seed: process.env.EXPO_PUBLIC_SEED !== 'false' });

/** The root layout of the app. */
export default function RootLayout() {
  return (
    <AppProviders>
      {/* Head throws on native; on web it replaces the empty <title> React Navigation injects. */}
      {Platform.OS === 'web' && (
        <Head>
          <title>Mowly</title>
        </Head>
      )}
      <Stack
        screenOptions={{
          headerTintColor: colors.primary,
          headerTitleAlign: 'center',
          headerTitleStyle: { color: colors.primary },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="quote" options={{ presentation: 'fullScreenModal', headerShown: false }} />
      </Stack>
    </AppProviders>
  );
}
