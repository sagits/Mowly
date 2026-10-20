// Service detail (C20): the upcoming service block, what's included and the five action rows.
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { useBooking, useService } from '@mowly/api';
import { FREQUENCY_LABELS, formatLong, formatMoney } from '@mowly/types';
import { Badge, ListRow, Screen, colors } from '@mowly/ui';

// Sheets for these rows arrive in Task 11; until then onPress is a no-op.
const ACTIONS = [
  ['skip', 'Skip', 'Skip your upcoming service'],
  ['reschedule', 'One-time reschedule', 'Move the date for your next service'],
  ['frequency', 'Change frequency', 'Change how often you get this service'],
  ['pause', 'Pause for the season', 'Temporarily stop service until spring'],
  ['cancel', 'Cancel', 'Cancel your service'],
] as const;

/** Booking detail for `/service/<id>`. Testid `service-detail`. */
export default function ServiceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: booking } = useBooking(id);
  const { data: service } = useService(booking?.serviceId ?? '');
  const paused = booking?.status === 'paused';
  return (
    <View testID="service-detail" className="flex-1">
      <Screen>
        {booking ? (
          <ScrollView>
            <View className="gap-3 border-b border-border p-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-title-sm text-ink">Upcoming Service</Text>
                <Badge label={paused ? 'Paused' : 'Scheduled'} tone={paused ? 'gray' : 'green'} />
              </View>
              {[
                ['calendar-outline', `${formatLong(booking.nextDate)} (${FREQUENCY_LABELS[booking.frequency]})`],
                ['cash-outline', `${formatMoney(booking.price)} per service`],
                ['person-outline', booking.proName],
              ].map(([icon, text]) => (
                <View key={icon} className="flex-row items-center gap-3">
                  <Ionicons name={icon as 'person-outline'} size={22} color={colors.ink} />
                  <Text className="text-base text-ink">{text}</Text>
                </View>
              ))}
            </View>
            <View className="border-b border-border p-4">
              <Text className="text-base font-semibold text-ink">What's included?</Text>
              <Text className="mt-2 text-base text-ink">{service?.included}</Text>
            </View>
            {ACTIONS.map(([key, title, subtitle]) => (
              <ListRow key={key} testID={`detail-${key}`} title={title} subtitle={subtitle} onPress={() => {}} />
            ))}
          </ScrollView>
        ) : null}
      </Screen>
    </View>
  );
}
