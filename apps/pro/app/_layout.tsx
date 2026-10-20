/** The root layout: loads the NativeWind stylesheet and wraps the navigation Stack in the app providers and the gesture root. */
import { Stack } from 'expo-router';
import Head from 'expo-router/head';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProviders } from '@mowly/features';
import { configureMocks } from '@mowly/mocks';
import { colors } from '@mowly/ui';
import '../global.css';

configureMocks({ seed: process.env.EXPO_PUBLIC_SEED !== 'false' });

/** The root layout of the app. */
export default function RootLayout() {
  return (
    <AppProviders>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {/* Head throws on native; on web it replaces the empty <title> React Navigation injects. */}
        {Platform.OS === 'web' && (
          <Head>
            <title>Mowly Pro</title>
          </Head>
        )}
        <Stack
          screenOptions={{
            headerTintColor: colors.primary,
            headerTitleAlign: 'center',
            headerTitleStyle: { color: colors.primary },
          }}
        >
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
          <Stack.Screen name="welcome" options={{ headerShown: false }} />
          <Stack.Screen name="sign-in" options={{ title: 'Sign In', headerBackTitle: 'Back', headerBackButtonDisplayMode: 'default' }} />
          <Stack.Screen name="sign-up" options={{ title: 'Sign Up', headerBackTitle: 'Back', headerBackButtonDisplayMode: 'default' }} />
        </Stack>
      </GestureHandlerRootView>
    </AppProviders>
  );
}
