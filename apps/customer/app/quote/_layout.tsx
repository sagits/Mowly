/** The full-screen quote funnel stack. Each screen draws its own FunnelHeader. */
import { Stack } from 'expo-router';
import { colors } from '@mowly/ui';
import { FunnelClose } from '../../src/components/FunnelHeader';

/** Stack for the funnel screens; the policy FAQ slides up as a modal. */
export default function QuoteLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="faq" options={{ presentation: 'modal' }} />
      <Stack.Screen
        name="account"
        options={{ headerShown: true, title: '', headerTintColor: colors.primary, headerShadowVisible: false, headerBackButtonDisplayMode: 'minimal', headerRight: () => <FunnelClose color={colors.primary} /> }}
      />
      <Stack.Screen name="booked" options={{ gestureEnabled: false }} />
    </Stack>
  );
}
