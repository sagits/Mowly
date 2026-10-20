/** A loading placeholder block. */
import { View } from 'react-native';

/** Gray block sized by `className` (e.g. `h-6 w-40`). */
export function Skeleton({ className = '', testID }: { className?: string; testID?: string }) {
  return <View testID={testID} className={`rounded-field bg-surfaceMuted ${className}`} />;
}
