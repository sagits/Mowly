/** Start date picker: the next 14 days from the next weekday (C09). */
import { Pressable, ScrollView, Text } from 'react-native';
import { addDays, formatShort, nextWeekday, weekdayShort, type IsoDate } from '@mowly/types';
import { BottomSheet } from '@mowly/ui';

/** 'Wed, Oct 21, 2026' */
export function formatPlanDate(date: IsoDate): string {
  return `${weekdayShort(date)}, ${formatShort(date)}, ${date.slice(0, 4)}`;
}

/** Tapping a row picks it and closes the sheet. */
export function DateSheet({
  visible,
  onClose,
  value,
  onPick,
  testID,
}: {
  visible: boolean;
  onClose: () => void;
  value: IsoDate | null;
  onPick: (date: IsoDate) => void;
  testID: string;
}) {
  const first = nextWeekday();
  const days = Array.from({ length: 14 }, (_, i) => addDays(first, i));
  return (
    <BottomSheet visible={visible} onClose={onClose} testID={testID} title="Preferred start date">
      <ScrollView className="max-h-96">
        {days.map((d) => (
          <Pressable
            key={d}
            testID={`date-option-${d}`}
            accessibilityRole="button"
            onPress={() => {
              onPick(d);
              onClose();
            }}
            className="border-b border-border py-4"
          >
            <Text className={`text-lg ${d === value ? 'font-bold text-primary' : 'text-ink'}`}>{formatPlanDate(d)}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </BottomSheet>
  );
}
