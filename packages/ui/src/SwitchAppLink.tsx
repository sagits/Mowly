/** Web-only link straight to the other app. */
import { Platform, Pressable, Text } from 'react-native';

const APPS = { customer: { name: 'Mowly', path: '/customer/' }, pro: { name: 'Mowly Pro', path: '/pro/' } };

/**
 * Renders nothing on native; on web a "Switch to <app name>" link that opens the `to` app at its base URL.
 * `focusable={false}` drops it from the tab order.
 */
export function SwitchAppLink({ to, focusable }: { to: keyof typeof APPS; focusable?: boolean }) {
  if (Platform.OS !== 'web') return null;
  const app = APPS[to];
  return (
    <Pressable
      testID="switch-app"
      accessibilityRole="link"
      tabIndex={focusable === false ? -1 : undefined}
      onPress={() => {
        // window.top: inside the desktop PhoneFrame iframe, reload the whole page so the other app gets its own frame.
        (window.top ?? window).location.href = app.path;
      }}
    >
      <Text className="text-sm text-link underline">{`Switch to ${app.name}`}</Text>
    </Pressable>
  );
}
