/** Tells components whether the window is wide enough for the web sidebar layout. */
import { useWindowDimensions } from 'react-native';
import { layout } from '../tokens';

/** True when the window width is at least `layout.wideBreakpoint`. */
export function useIsWide(): boolean {
  return useWindowDimensions().width >= layout.wideBreakpoint;
}
