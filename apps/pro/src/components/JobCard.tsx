/** The selected job: address, yard size and one row per available date. */
import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { formatMoney, formatShort, FREQUENCY_LABELS, weekdayShort } from '@mowly/types';
import type { IsoDate, Job } from '@mowly/types';
import { colors } from '@mowly/ui';

const fullDate = (d: IsoDate) => `${weekdayShort(d)}, ${formatShort(d)}`;

/** Tapping a date row calls `onPickDate`. */
export function JobCard({ job, onPickDate }: { job: Job; onPickDate: (date: IsoDate) => void }) {
  const n = job.availableDates.length;
  const { line1, city, state, zip } = job.address;
  return (
    <View testID="job-card" className="gap-1 bg-primaryTint/40 px-4 pb-6 pt-4">
      <Text className="text-xl text-ink">{line1}</Text>
      <Text className="text-xl text-ink">{`${city}, ${state} ${zip}`}</Text>
      <Text className="text-base text-inkProBody">{`${job.yardSqft} sq ft / ${(job.yardSqft / 43560).toFixed(2)} acre est. yard size`}</Text>
      <Text className="my-2 text-lg text-inkPro">
        <Text className="font-semibold text-primary">{`${n} ${n === 1 ? 'date' : 'dates'} available`}</Text> for pick up
      </Text>
      {job.availableDates.map((date) => (
        <Pressable
          key={date}
          testID={`job-date-${job.id}-${date}`}
          accessibilityRole="button"
          onPress={() => onPickDate(date)}
          className="mb-3 gap-2 rounded-card bg-surface p-4 shadow"
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-primary">{`${job.serviceName}, ${FREQUENCY_LABELS[job.frequency]}`}</Text>
            <Text className="text-xl font-bold text-primary">{formatMoney(job.price)}</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Ionicons name="calendar-outline" size={22} color={colors.inkPro} />
            <Text className="text-lg font-semibold text-accent">{fullDate(date)}</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Ionicons name="location-sharp" size={22} color={colors.inkPro} />
            <Text className="text-base text-inkProBody">
              <Text className="font-bold text-ink">{`${job.distanceMiles} ${job.distanceMiles === 1 ? 'mile' : 'miles'}`}</Text> from previous job on route
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}
