/** Web-only link straight to the other app. */
import { useSyncExternalStore } from 'react';
import { Platform, Pressable, Text } from 'react-native';

// `path` is the app's base URL on the built site; `devPort` is its `pnpm web` dev server (apps/*/package.json).
const APPS = {
  customer: { label: 'Switch to client app', path: '/customer/', devPort: 8091 },
  pro: { label: 'Switch to provider app', path: '/pro/', devPort: 8092 },
};

/** The two web apps. */
export type AppId = keyof typeof APPS;

const subscribe = () => () => {};
// False while hydrating, so the first client render matches the static HTML.
const inFrame = () => Platform.OS === 'web' && window.self !== window.top;

/**
 * Renders nothing on native; on web a "Switch to client app" / "Switch to provider app" link that opens the `to` app.
 * Inside the desktop PhoneFrame iframe it hides, because the frame shows it above the phone.
 * `focusable={false}` drops it from the tab order. Put spacing in `className`, not on a wrapper, so it hides with the link.
 */
export function SwitchAppLink({ to, focusable, className }: { to: AppId; focusable?: boolean; className?: string }) {
  const hidden = useSyncExternalStore(subscribe, inFrame, () => false);
  if (Platform.OS !== 'web' || hidden) return null;
  const app = APPS[to];
  return (
    <Pressable
      testID="switch-app"
      accessibilityRole="link"
      tabIndex={focusable === false ? -1 : undefined}
      className={className}
      onPress={() => {
        // ponytail: in dev each app has its own server, so jump to the other port; the built site serves both on one origin.
        const href = __DEV__ ? `${window.location.protocol}//${window.location.hostname}:${app.devPort}/` : app.path;
        // window.top: always switch the whole page, never just an iframe.
        (window.top ?? window).location.href = href;
      }}
    >
      <Text className="text-sm text-link underline">{app.label}</Text>
    </Pressable>
  );
}
