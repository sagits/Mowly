/** The colored band at the top of a screen. */
import { Text, View } from 'react-native';
import type { ReactNode } from 'react';

/** Band with the title and optional `leading` and `action` slots. `pt-16` so it runs under the status bar. */
export function HeaderBand({
  title,
  leading,
  action,
}: {
  title: string;
  leading?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <View className="flex-row items-center gap-3 bg-primary px-5 pb-6 pt-16">
      {leading}
      <Text className="flex-1 text-2xl font-semibold text-surface">{title}</Text>
      {action}
    </View>
  );
}
