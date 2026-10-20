/** The root layout: loads the NativeWind stylesheet and wraps the navigation Stack in the app providers. */
import { Stack } from 'expo-router';
import { AppProviders } from '@mowly/features';
import '../global.css';

/** The root layout of the app. */
export default function RootLayout() {
  return (
    <AppProviders>
      <Stack />
    </AppProviders>
  );
}
