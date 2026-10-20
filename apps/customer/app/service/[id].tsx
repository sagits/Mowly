/** Placeholder service detail; Task 9 replaces it. */
import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { useBookings } from '@mowly/api';
import { Screen } from '@mowly/ui';

/** Shows the booked service's name. */
export default function ServiceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const booking = useBookings().data?.find((b) => b.id === id);
  return (
    <View testID="service-detail" className="flex-1">
      <Screen>
        <Text className="px-4 pt-16 text-title-sm text-ink">{booking?.serviceName ?? ''}</Text>
      </Screen>
    </View>
  );
}
