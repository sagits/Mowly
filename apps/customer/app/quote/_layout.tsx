/** The full-screen quote funnel stack. Each screen draws its own FunnelHeader. */
import { Stack } from 'expo-router';

/** Stack for the funnel screens. */
export default function QuoteLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
