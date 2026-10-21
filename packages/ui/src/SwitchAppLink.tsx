/** Web-only link straight to the other app. */
import { useSyncExternalStore } from 'react';
import { Platform, Pressable, Text } from 'react-native';

const APPS = { customer: { name: 'Mowly', path: '/customer/' }, pro: { name: 'Mowly Pro', path: '/pro/' } };

/** The two web apps. */
export type AppId = keyof typeof APPS;

const subscribe = () => () => {};
// False while hydrating, so the first client render matches the static HTML.
const inFrame = () => Platform.OS === 'web' && window.self !== window.top;

/**
 * Renders nothing on native; on web a "Switch to <app name>" link that opens the `to` app at its base URL.
 * Inside the desktop PhoneFrame iframe it hides, because the frame shows it above the phone.
 * `focusable={false}` drops it from the tab order.
 */
export function SwitchAppLink({ to, focusable }: { to: AppId; focusable?: boolean }) {
  const hidden = useSyncExternalStore(subscribe, inFrame, () => false);
  if (Platform.OS !== 'web' || hidden) return null;
  const app = APPS[to];
  return (
    <Pressable
      testID="switch-app"
      accessibilityRole="link"
      tabIndex={focusable === false ? -1 : undefined}
      onPress={() => {
        // window.top: always switch the whole page, never just an iframe.
        (window.top ?? window).location.href = app.path;
      }}
    >
      <Text className="text-sm text-link underline">{`Switch to ${app.name}`}</Text>
    </Pressable>
  );
}
