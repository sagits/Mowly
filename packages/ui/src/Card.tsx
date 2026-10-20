/** A white raised surface. */
import type { ReactNode } from 'react';
import { View } from 'react-native';

/** Rounded white container; `className` adds spacing or layout. */
export function Card({ children, className = '', testID }: { children?: ReactNode; className?: string; testID?: string }) {
  return (
    <View testID={testID} className={`rounded-card border border-border bg-surface ${className}`}>
      {children}
    </View>
  );
}
