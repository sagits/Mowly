/** Booking confirmation: "You're booked!" with the service, plan and first date. */
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { useService } from '@mowly/api';
import { FREQUENCY_LABELS } from '@mowly/types';
import { Button, colors, Screen } from '@mowly/ui';
import { formatPlanDate } from '../../src/components/DateSheet';
import { useQuoteDraft } from '../../src/stores/useQuoteDraft';

/** The confirmation screen. The draft is kept until GO TO MY SERVICES, which clears it. */
export default function QuoteBookedScreen() {
  const router = useRouter();
  // read once: GO TO MY SERVICES clears the draft before the screen is gone
  const [{ serviceId, frequency, startDate }] = useState(() => useQuoteDraft.getState());
  const { data: service } = useService(serviceId ?? '');
  return (
    <Screen>
      <View testID="booked-screen" className="flex-1 items-center justify-center px-6">
        <View className="h-28 w-28 items-center justify-center rounded-full bg-primary">
          <Ionicons name="checkmark" size={64} color={colors.surface} />
        </View>
        <Text className="mt-6 text-3xl font-bold text-ink">You&apos;re booked!</Text>
        <Text className="mt-3 text-center text-lg text-muted">
          {`${service?.name ?? ''}, ${frequency ? FREQUENCY_LABELS[frequency] : ''}. First service on ${startDate ? formatPlanDate(startDate) : ''}. We'll match you with a pro and message you in the Inbox.`}
        </Text>
      </View>
      <View className="px-4 pb-6">
        <Button
          testID="booked-go"
          label="Go to my services"
          onPress={() => {
            useQuoteDraft.getState().reset();
            if (router.canDismiss()) router.dismissAll();
            router.replace('/services');
          }}
        />
      </View>
    </Screen>
  );
}
