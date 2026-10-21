/** The desktop web showcase: the app running in an iframe inside a drawn iPhone, so the site reads as the phone app. */
import { Ionicons } from '@expo/vector-icons';
import { createElement, useState, useSyncExternalStore } from 'react';
import { Platform, Text, useWindowDimensions, View } from 'react-native';
import { colors, layout } from '../tokens';

// iPhone 16 points: the screen, the bezel around it, the status bar and the home indicator strip.
const SCREEN = { width: 393, height: 852 };
const BEZEL = 14;
const STATUS_BAR = 54;
const HOME_STRIP = 21;

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

/** A centered iPhone whose screen is an iframe of the current URL; scaled down to fit short windows. */
export function PhoneFrame() {
  const [src] = useState(() => window.location.href);
  const { height } = useWindowDimensions();
  const outerHeight = SCREEN.height + BEZEL * 2;
  const scale = Math.min(1, (height - 48) / outerHeight);
  return (
    <View testID="phone-frame" className="flex-1 items-center justify-center bg-pageMuted">
      <View
        style={{
          width: SCREEN.width + BEZEL * 2,
          height: outerHeight,
          padding: BEZEL,
          borderRadius: 68,
          backgroundColor: colors.ink,
          transform: [{ scale }],
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
            style: { flex: 1, width: '100%', border: 0, display: 'block' },
          })}
          <View style={{ height: HOME_STRIP }} className="items-center justify-center">
            <View style={{ width: 134, height: 5, borderRadius: 3, backgroundColor: colors.ink }} />
          </View>
        </View>
      </View>
    </View>
  );
}
