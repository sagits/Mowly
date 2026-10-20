// Header title for the Service detail screen (C20): service name over the address.
import { Text, View } from 'react-native';
import { useBooking } from '@mowly/api';

/** Reads the booking by id so the layout can render the title before the screen mounts. */
export function ServiceDetailTitle({ id }: { id: string }) {
  const { data: booking } = useBooking(id);
  return (
    <View>
      <Text className="text-lg font-semibold text-white">{booking?.serviceName}</Text>
      <Text className="text-sm text-white">{booking?.address.line1}</Text>
    </View>
  );
}
