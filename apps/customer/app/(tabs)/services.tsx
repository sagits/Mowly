/** The My Services tab: the customer's bookings, newest first (C19). */
import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { useBookings } from '@mowly/api';
import { Button, Screen, Skeleton } from '@mowly/ui';
import { BookingCard } from '../../src/components/BookingCard';
import { CustomerHeader } from '../../src/components/CustomerHeader';
import { useQuoteDraft } from '../../src/stores/useQuoteDraft';

/** The My Services tab. */
export default function MyServicesScreen() {
  const router = useRouter();
  const { data: bookings, isPending } = useBookings();
  return (
    <View testID="screen-services" className="flex-1">
      <Screen>
        <CustomerHeader title="My Services" />
        {isPending ? (
          <View testID="services-loading" className="px-4 pt-4">
            <Skeleton className="mb-4 h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </View>
        ) : !bookings?.length ? (
          <View testID="services-empty" className="flex-1 items-center justify-center px-8">
            <Text className="mb-6 text-lg text-muted">No services yet</Text>
            <Button
              testID="services-get-quote"
              label="Get a quote"
              onPress={() => {
                useQuoteDraft.getState().reset();
                router.push('/quote');
              }}
            />
          </View>
        ) : (
          <ScrollView className="flex-1" contentContainerClassName="px-4 pt-4">
            {bookings.map((b) => (
              <BookingCard key={b.id} booking={b} onPress={() => router.push({ pathname: "/service/[id]", params: { id: b.id } })} />
            ))}
          </ScrollView>
        )}
      </Screen>
    </View>
  );
}
