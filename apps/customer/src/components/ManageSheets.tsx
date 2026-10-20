// The five sheets behind the Service detail action rows (invented; see prototype c-manage).
import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useQuote, useUpdateBooking } from '@mowly/api';
import { today, type Booking, type BookingChange, type Frequency } from '@mowly/types';
import { BottomSheet, Button, ConfirmDialog } from '@mowly/ui';
import { DateSheet } from './DateSheet';
import { PlanRow } from './PlanRow';

export type ManageKind = 'skip' | 'reschedule' | 'frequency' | 'pause' | 'cancel';

/** First day of each of the next 6 months as `YYYY-MM-01`. */
function nextMonths(): string[] {
  const [y, m] = today().split('-').map(Number) as [number, number];
  return Array.from({ length: 6 }, (_, i) => {
    const t = y * 12 + (m - 1) + 1 + i;
    return `${Math.floor(t / 12)}-${String((t % 12) + 1).padStart(2, '0')}-01`;
  });
}

/** Month name of a `YYYY-MM-DD` date. */
export const monthName = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleString('en-US', { month: 'long' });

/** Renders the sheet for `open` (or nothing); each one runs its change on the booking, then closes. */
export function ManageSheets({ booking, open, onClose }: { booking: Booking; open: ManageKind | null; onClose: () => void }) {
  const update = useUpdateBooking();
  const { data: quote } = useQuote(booking.serviceId, booking.address.id);
  const [picked, setPicked] = useState<Frequency | null>(null);
  const run = (change: BookingChange, after?: () => void) =>
    update.mutate({ id: booking.id, change }, { onSuccess: after });
  const apply = (change: BookingChange, after?: () => void) => {
    onClose();
    run(change, after);
  };
  const frequency = picked ?? booking.frequency;
  return (
    <>
      <ConfirmDialog
        visible={open === 'skip'}
        title="Skip your next service?"
        message="Your upcoming service will be skipped. The plan continues after it."
        keepTestID="skip-keep"
        keepLabel="Keep as is"
        onKeep={onClose}
        confirmTestID="skip-confirm"
        confirmLabel="Skip service"
        destructive={false}
        onConfirm={() => apply({ type: 'skip' })}
      />
      <ConfirmDialog
        visible={open === 'cancel'}
        title="Cancel this service?"
        message="You can book again any time from Browse."
        keepTestID="cancel-keep"
        keepLabel="Keep as is"
        onKeep={onClose}
        confirmTestID="cancel-confirm"
        confirmLabel="Cancel service"
        onConfirm={() => apply({ type: 'cancel' }, () => router.back())}
      />
      <DateSheet
        visible={open === 'reschedule'}
        testID="reschedule-sheet"
        onClose={onClose}
        value={booking.nextDate}
        onPick={(date) => run({ type: 'reschedule', date })}
      />
      <BottomSheet visible={open === 'frequency'} onClose={onClose} testID="frequency-sheet" title="Change frequency">
        <View className="gap-3">
          {quote?.plans.map((p) => (
            <PlanRow key={p.frequency} plan={p} selected={p.frequency === frequency} onPress={() => setPicked(p.frequency)} testID={`frequency-${p.frequency}`} />
          ))}
          <Button
            testID="frequency-save"
            label="Save"
            onPress={() => {
              const plan = quote?.plans.find((p) => p.frequency === frequency);
              if (plan) apply({ type: 'frequency', frequency, price: plan.price });
            }}
          />
        </View>
      </BottomSheet>
      <BottomSheet visible={open === 'pause'} onClose={onClose} testID="pause-sheet" title="Pause for the season">
        {nextMonths().map((until) => (
          <Pressable key={until} testID={`pause-month-${until.slice(0, 7)}`} onPress={() => apply({ type: 'pause', until })} className="border-b border-border py-4">
            <Text className="text-lg text-ink">{`${monthName(until)} ${until.slice(0, 4)}`}</Text>
          </Pressable>
        ))}
      </BottomSheet>
    </>
  );
}
