/** The root layout: loads the NativeWind stylesheet and wraps the navigation Stack in the app providers. */
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import Head from 'expo-router/head';
import { LogBox, Platform } from 'react-native';
import { AppProviders } from '@mowly/features';
import { configureMocks } from '@mowly/mocks';
import { colors, PhoneFrame, useShowPhoneFrame } from '@mowly/ui';
import { ServiceDetailTitle } from '../src/components/ServiceDetailTitle';
import '../global.css';

configureMocks({ seed: process.env.EXPO_PUBLIC_SEED !== 'false' });
// ponytail: dev-only RN warning from library animations (no listener on a native-driven value); harmless
LogBox.ignoreLogs(['Sending `onAnimatedValueUpdate` with no listeners registered']);

/** The root layout of the app. */
export default function RootLayout() {
  // Static render only: registering the icon font makes the HTML draw the glyphs and embed the @font-face, so every
  // icon hydrates as drawn. Without it, icons that mount after the client loads the font no longer match the HTML.
  if (typeof window === 'undefined') void Ionicons.loadFont();
  // Desktop web shows the app inside a drawn iPhone; the iframe in it renders this layout again, unframed.
  if (useShowPhoneFrame()) return <PhoneFrame switchTo="pro" />;
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
        <Stack.Screen
          name="service/[id]"
          options={({ route }) => ({
            headerStyle: { backgroundColor: colors.primaryHeader },
            headerTintColor: colors.surface,
            headerTitleAlign: 'left',
            headerBackButtonDisplayMode: 'minimal',
            headerTitle: () => <ServiceDetailTitle id={(route.params as { id: string }).id} />,
            headerRight: () => <Ionicons name="help-circle-outline" size={28} color={colors.surface} />,
          })}
        />
        {/* The chat screen sets its title (the pro's name) on the client; '' keeps the static render from showing the route name. */}
        <Stack.Screen name="chat/[id]" options={{ title: '' }} />
        <Stack.Screen name="quote" options={{ presentation: 'fullScreenModal', headerShown: false }} />
      </Stack>
    </AppProviders>
  );
}
