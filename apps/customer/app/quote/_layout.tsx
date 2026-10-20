/** The full-screen quote funnel stack. Each screen draws its own FunnelHeader. */
import { Stack } from 'expo-router';
import { colors } from '@mowly/ui';

/** Stack for the funnel screens; the policy FAQ slides up as a modal. */
export default function QuoteLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="faq" options={{ presentation: 'modal' }} />
      <Stack.Screen
        name="account"
        options={{ headerShown: true, title: '', headerTintColor: colors.primary, headerShadowVisible: false, headerBackButtonDisplayMode: 'minimal' }}
      />
      <Stack.Screen name="booked" options={{ gestureEnabled: false }} />
    </Stack>
  );
}
