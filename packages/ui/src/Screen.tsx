/** The container every screen sits in. */
import { View } from 'react-native';
import type { ReactNode } from 'react';
import { useIsWide } from './useIsWide';

/**
 * White screen container; `muted` switches to the gray `pageMuted` ground. On wide windows the
 * children are centered in a `max-w-content` column, so no screen re-implements the centering.
 */
export function Screen({ children, muted = false }: { children?: ReactNode; muted?: boolean }) {
  const wide = useIsWide();
  return (
    <View className={`flex-1 ${muted ? 'bg-pageMuted' : 'bg-surface'}`}>
      {wide ? <View className="w-full max-w-content flex-1 self-center">{children}</View> : children}
    </View>
  );
}
