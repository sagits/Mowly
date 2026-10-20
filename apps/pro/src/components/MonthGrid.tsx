/** One month of the Calendar: title, weekday header and a date tab per day with its job count. */
import { Pressable, Text, View } from 'react-native';
import { today } from '@mowly/types';
import type { IsoDate } from '@mowly/types';
import { monthGrid } from '../calendar';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

/** Today's cell is `day-today` (Maestro has no clock). Only days with jobs are pressable. */
export function MonthGrid({
  year,
  month0,
  counts,
  onPressDay,
}: {
  year: number;
  month0: number;
  counts: Record<IsoDate, number>;
  onPressDay: (date: IsoDate) => void;
}) {
  const now = today();
  const ym = `${year}-${String(month0 + 1).padStart(2, '0')}`;
  return (
    <View testID={`month-${ym}`} className="px-3 pb-6">
      <Text className="py-4 text-center text-2xl text-inkPro">{`${MONTHS[month0]!} ${year}`}</Text>
      <View className="flex-row pb-2">
        {WEEKDAYS.map((w) => (
          <Text key={w} className="flex-1 text-center text-sm text-inkPro">{w}</Text>
        ))}
      </View>
      {monthGrid(year, month0).map((week, w) => (
        <View key={w} testID={`week-${ym}-${w}`} className="flex-row">
          {week.map((date, i) => {
            if (!date) return <View key={i} className="flex-1" />;
            const n = counts[date] ?? 0;
            const id = date === now ? 'day-today' : `day-${date}`;
            return (
              <View key={date} className="flex-1 items-center">
                <Pressable
                  testID={id}
                  accessibilityRole={n ? 'button' : undefined}
                  disabled={!n}
                  onPress={() => onPressDay(date)}
                  className={`my-1 h-14 w-12 overflow-hidden rounded-field border bg-surface ${date === now ? 'border-2 border-primary' : 'border-border'}`}
                >
                  <View className="bg-priceBlock py-px">
                    <Text className="text-center text-xs font-bold text-surface">{Number(date.slice(8))}</Text>
                  </View>
                  {n > 0 && (
                    <Text testID={`${id}-count`} className={`text-center text-2xl font-semibold ${date < now ? 'text-priceBlock' : 'text-calendarBlue'}`}>
                      {n}
                    </Text>
                  )}
                </Pressable>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}
