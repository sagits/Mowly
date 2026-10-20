/** The container every screen sits in. */
import { View } from 'react-native';
import type { ReactNode } from 'react';

/** White screen container; `muted` switches to the gray `pageMuted` ground. */
export function Screen({ children, muted = false }: { children?: ReactNode; muted?: boolean }) {
  return <View className={`flex-1 ${muted ? 'bg-pageMuted' : 'bg-surface'}`}>{children}</View>;
}
