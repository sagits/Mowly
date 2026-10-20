/** Tells components whether the window is wide enough for the web sidebar layout. */
import { useSyncExternalStore } from 'react';
import { useWindowDimensions } from 'react-native';
import { layout } from '../tokens';

const subscribe = () => () => {};

/**
 * True when the window width is at least `layout.wideBreakpoint`. While hydrating, the server
 * snapshot reports "not mounted", so the first client render matches the static HTML (narrow).
 */
export function useIsWide(): boolean {
  const wide = useWindowDimensions().width >= layout.wideBreakpoint;
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  return mounted && wide;
}
