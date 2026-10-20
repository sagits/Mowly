/** The pro app's one loading pattern (PRD "Loading states"): skeleton rows for lists and cards, a centered spinner for full-screen loads. */
import { View } from 'react-native';
import { Skeleton, Spinner } from '@mowly/ui';

/** With `rows`, that many skeleton rows (lists, cards, the calendar); without, a centered spinner (forms, details). */
export function ScreenLoading({ rows }: { rows?: number }) {
  if (!rows) {
    return (
      <View testID="screen-loading" className="flex-1 items-center justify-center bg-surface">
        <Spinner />
      </View>
    );
  }
  return (
    <View testID="screen-loading" className="gap-3 p-4">
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} className="h-14 w-full" />
      ))}
    </View>
  );
}
