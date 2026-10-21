/** The desktop web showcase: the app running in an iframe inside a drawn iPhone, so the site reads as the phone app. */
import { Ionicons } from '@expo/vector-icons';
import { createElement, useState, useSyncExternalStore } from 'react';
import { Platform, Pressable, Text, useWindowDimensions, View } from 'react-native';
import { colors, layout } from '../tokens';
import { type AppId, SwitchAppLink, switchToApp } from './SwitchAppLink';

// iPhone 16 points: the screen, the bezel around it, the status bar and the home indicator strip.
const SCREEN = { width: 393, height: 852 };
const BEZEL = 14;
const STATUS_BAR = 54;
const HOME_STRIP = 21;
// Room above the phone for the switch link.
const LINK_SPACE = 40;

const subscribe = () => () => {};

/** Desktop browser (fine pointer, wide window) and not already inside the frame's iframe. */
function isDesktopTop(): boolean {
  if (Platform.OS !== 'web' || window.self !== window.top) return false;
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches && window.innerWidth >= layout.wideBreakpoint;
}

/**
 * True when the root layout should show `PhoneFrame` instead of the app. While hydrating, the server
 * snapshot is false, so the first client render matches the static HTML; phones never switch.
 */
export function useShowPhoneFrame(): boolean {
  return useSyncExternalStore(subscribe, isDesktopTop, () => false);
}

const LINKEDIN = 'https://www.linkedin.com/in/renato-probst/';
const REPO = 'https://github.com/sagits/Mowly';

/** A link that opens `href` in a new tab. */
function ExternalLink({ href, label, testID }: { href: string; label: string; testID: string }) {
  return (
    <Pressable testID={testID} accessibilityRole="link" onPress={() => window.open(href, '_blank', 'noopener')}>
      <Text className="text-sm text-link underline">{label}</Text>
    </Pressable>
  );
}

// What a reviewer opening the link needs to know: the two apps and, at a high level, their screens.
const APP_GUIDE: Record<AppId, { title: string; audience: string; screens: string[] }> = {
  customer: {
    title: 'Mowly (client app)',
    audience: 'For homeowners who need lawn care.',
    screens: [
      'Browse services and get an instant quote',
      'Quote flow: address, yard size, plan, account, booking',
      'My services: skip, reschedule, pause, change frequency or cancel',
      'Inbox and chat with the assigned pro',
      'Profile',
    ],
  },
  pro: {
    title: 'Mowly Pro (provider app)',
    audience: 'For lawn care pros who take the jobs.',
    screens: [
      'Welcome, sign in and sign up',
      'Dashboard with an 8-step onboarding checklist',
      'Available jobs on a map, with claim',
      'Calendar, job details and the daily route map',
      'Settings: business profile, billing, bank, notifications',
      'Crews, inbox, customer search, performance, support',
    ],
  },
};

/** Left of the phone: what the site is, both apps and their screens, and a second switch link. */
function Guide({ switchTo }: { switchTo: AppId }) {
  const current: AppId = switchTo === 'pro' ? 'customer' : 'pro';
  return (
    <View testID="phone-frame-guide" style={{ maxWidth: 380, flexShrink: 1 }} className="gap-5">
      <View className="gap-2">
        <Text className="text-2xl font-bold text-ink">Mowly</Text>
        <Text className="text-base text-inkProBody">
          A lawn care marketplace with two apps, built from one Expo and React Native monorepo for iOS and the web. This
          site is the real iOS app running in the browser through React Native Web. Use the phone on the right as you
          would on an iPhone. Everything runs on sample data, so reloading starts over.
        </Text>
      </View>
      {(['customer', 'pro'] as const).map((id) => {
        const app = APP_GUIDE[id];
        const onScreen = id === current;
        // The other app's card opens it; the card on screen does nothing.
        return (
          <Pressable
            key={id}
            testID={`guide-${id}`}
            accessibilityRole={onScreen ? undefined : 'link'}
            disabled={onScreen}
            onPress={() => switchToApp(id)}
            className={`gap-1 rounded-card border p-4 ${onScreen ? 'border-primary bg-surface' : 'border-border hover:border-primary hover:bg-surface'}`}
          >
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-bold text-ink">{app.title}</Text>
              <Text className={`text-sm font-semibold ${onScreen ? 'text-primary' : 'text-link underline'}`}>
                {onScreen ? 'On screen now' : 'Click to see'}
              </Text>
            </View>
            <Text className="pb-1 text-sm text-muted">{app.audience}</Text>
            {app.screens.map((screen) => (
              <Text key={screen} className="text-sm text-inkProBody">{`•  ${screen}`}</Text>
            ))}
          </Pressable>
        );
      })}
      <SwitchAppLink to={switchTo} />
      <View className="flex-row flex-wrap items-center gap-x-1">
        <Text className="text-sm text-muted">Built by</Text>
        <ExternalLink testID="linkedin" href={LINKEDIN} label="Renato Probst" />
        <Text className="text-sm text-muted">·</Text>
        <ExternalLink testID="repo" href={REPO} label="Source code on GitHub" />
      </View>
    </View>
  );
}

/** The drawn iPhone: bezel, status bar, the app in an iframe of the current URL, home indicator. */
function Phone({ scale }: { scale: number }) {
  const [src] = useState(() => window.location.href);
  const outerHeight = SCREEN.height + BEZEL * 2;
  return (
    <View
      style={{
        width: SCREEN.width + BEZEL * 2,
        height: outerHeight,
        padding: BEZEL,
        borderRadius: 68,
        backgroundColor: colors.ink,
        transform: [{ scale }],
        // scale shrinks only the drawing; pull the layout box in too so the link sits right above the phone
        marginVertical: (-outerHeight * (1 - scale)) / 2,
        boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
      }}
    >
      <View style={{ flex: 1, borderRadius: 55, overflow: 'hidden', backgroundColor: colors.surface }}>
        <View style={{ height: STATUS_BAR }} className="flex-row items-center justify-between px-8 pt-2">
          <Text className="w-16 text-base font-semibold text-ink">9:41</Text>
          <View style={{ width: 126, height: 37, borderRadius: 19, backgroundColor: colors.ink }} />
          <View className="w-16 flex-row justify-end gap-1">
            <Ionicons name="cellular" size={16} color={colors.ink} />
            <Ionicons name="wifi" size={16} color={colors.ink} />
            <Ionicons name="battery-full" size={18} color={colors.ink} />
          </View>
        </View>
        {createElement('iframe', {
          src,
          title: 'App preview',
          // The outer page's router mounts during hydration and, once the frame replaces it, rewrites the address bar
          // (to `/pro/sign-in`, `/customer/`). Put back the screen the phone shows so the deep link survives a reload.
          onLoad: (e: { currentTarget: HTMLIFrameElement }) => {
            const inner = e.currentTarget.contentWindow?.location;
            if (inner) window.history.replaceState(window.history.state, '', inner.pathname + inner.search + inner.hash);
          },
          style: { flex: 1, width: '100%', border: 0, display: 'block' },
        })}
        <View style={{ height: HOME_STRIP }} className="items-center justify-center">
          <View style={{ width: 134, height: 5, borderRadius: 3, backgroundColor: colors.ink }} />
        </View>
      </View>
    </View>
  );
}

/** The desktop showcase: the guide on the left, the phone on the right with the switch link above it; scaled down to fit short windows. */
export function PhoneFrame({ switchTo }: { switchTo: AppId }) {
  const { height } = useWindowDimensions();
  const scale = Math.min(1, (height - LINK_SPACE - 48) / (SCREEN.height + BEZEL * 2));
  return (
    <View testID="phone-frame" className="flex-1 flex-row items-center justify-center gap-16 bg-pageMuted px-8">
      <Guide switchTo={switchTo} />
      <View className="items-center">
        <View style={{ height: LINK_SPACE }} className="justify-center">
          <SwitchAppLink to={switchTo} />
        </View>
        <Phone scale={scale} />
      </View>
    </View>
  );
}
