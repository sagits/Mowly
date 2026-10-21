/** The "All" plus next-five-days filter above the map. */
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { addDays, today, weekdayShort } from '@mowly/types';
import type { IsoDate } from '@mowly/types';

/** `value` is the selected day or undefined for All. Today's cell is `day-today` (Maestro has no clock). */
export function DayStrip({ value, onChange }: { value: IsoDate | undefined; onChange: (day: IsoDate | undefined) => void }) {
  const days = [0, 1, 2, 3, 4].map((n) => addDays(today(), n));
  return (
    <View className="flex-row border-y border-border">
      <Cell testID="day-all" selected={value === undefined} onPress={() => onChange(undefined)}>
        <Text className={`text-xl font-semibold ${value === undefined ? 'text-surface' : 'text-inkPro'}`}>All</Text>
      </Cell>
      {days.map((day, i) => {
        const color = value === day ? 'text-surface' : 'text-inkPro';
        return (
          <Cell key={day} testID={i === 0 ? 'day-today' : `day-${day}`} selected={value === day} onPress={() => onChange(day)}>
            <Text className={`text-base ${color}`}>{weekdayShort(day)}</Text>
            <Text className={`text-base ${color}`}>{Number(day.slice(8))}</Text>
          </Cell>
        );
      })}
    </View>
  );
}

function Cell({ testID, selected, onPress, children }: { testID: string; selected: boolean; onPress: () => void; children: ReactNode }) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      className={`h-14 flex-1 items-center justify-center border-r border-border ${selected ? 'bg-primary' : 'bg-surface'}`}
    >
      {children}
    </Pressable>
  );
}
