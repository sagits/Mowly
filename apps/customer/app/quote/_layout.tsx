/** The full-screen quote funnel stack. Each screen draws its own FunnelHeader. */
import { Stack } from 'expo-router';

/** Stack for the funnel screens; the policy FAQ slides up as a modal. */
export default function QuoteLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="faq" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
