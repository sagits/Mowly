/** The green band at the top of a signed-in screen. */
import { Text, View } from 'react-native';
import type { ReactNode } from 'react';

/** Band with the white title, optional `leading` and `action` slots and a `children` row below (the address). `pt-16` so it runs under the status bar on iOS; `web:pt-5` because a browser or the desktop phone frame draws its own. */
export function HeaderBand({
  title,
  leading,
  action,
  children,
}: {
  title: string;
  leading?: ReactNode;
  action?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <View className="bg-primaryHeader px-5 pb-4 pt-16 web:pt-5">
      <View className="flex-row items-center gap-3">
        {leading}
        <Text className="flex-1 text-title-sm text-surface">{title}</Text>
        {action}
      </View>
      {children}
    </View>
  );
}
