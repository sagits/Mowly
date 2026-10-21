// One row of the My Services list (C19).
import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import type { Booking } from '@mowly/types';
import { FREQUENCY_LABELS, formatLong } from '@mowly/types';
import { Badge, colors } from '@mowly/ui';

/** Card with a green left border: service, status chip, next date, frequency and a chevron. Testid `booking-card-<id>`. */
export function BookingCard({ booking, onPress }: { booking: Booking; onPress: () => void }) {
  const paused = booking.status === 'paused';
  return (
    <Pressable
      testID={`booking-card-${booking.id}`}
      onPress={onPress}
      accessibilityRole="button"
      className="mb-4 flex-row overflow-hidden rounded-xl border border-border bg-surface shadow-sm"
    >
      <View className="w-1 bg-primary" />
      <View className="flex-1 p-4">
        <View className="flex-row items-center justify-between">
          <Text className="flex-1 text-lg font-semibold text-inkPro">{booking.serviceName}</Text>
          <Badge label={paused ? 'Paused' : 'Scheduled'} tone={paused ? 'gray' : 'green'} />
        </View>
        <View className="mt-3 flex-row items-center gap-2">
          <Ionicons name="calendar-outline" size={20} color={colors.ink} />
          <Text className="text-base text-ink">{`Next service ${formatLong(booking.nextDate)}`}</Text>
        </View>
        <View className="mt-2 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Ionicons name="time-outline" size={20} color={colors.ink} />
            <Text className="text-base text-ink">{FREQUENCY_LABELS[booking.frequency]}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.ink} />
        </View>
      </View>
    </Pressable>
  );
}
