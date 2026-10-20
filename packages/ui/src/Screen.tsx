/** The container every screen sits in. */
import { View } from 'react-native';
import type { ReactNode } from 'react';

/** The app-background container for a screen. */
export function Screen({ children }: { children?: ReactNode }) {
  return <View className="flex-1 bg-background">{children}</View>;
}
