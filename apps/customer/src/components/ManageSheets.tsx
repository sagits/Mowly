// The five sheets behind the Service detail action rows (invented; see prototype c-manage).
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useQuote, useUpdateBooking } from '@mowly/api';
import { today, type Booking, type BookingChange, type Frequency } from '@mowly/types';
import { BottomSheet, Button, ConfirmDialog, showToast } from '@mowly/ui';
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

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** Month name of a `YYYY-MM-DD` date. */
export const monthName = (iso: string) => MONTHS[Number(iso.slice(5, 7)) - 1]!;

/** Renders the sheet for `open` (or nothing); each one runs its change on the booking, then closes. */
export function ManageSheets({ booking, open, onClose }: { booking: Booking; open: ManageKind | null; onClose: () => void }) {
  const update = useUpdateBooking();
  const { data: quote } = useQuote(booking.serviceId, booking.address.id);
  const [picked, setPicked] = useState<Frequency | null>(null);
  // A pick that was never saved must not outlive its sheet.
  useEffect(() => {
    if (open !== 'frequency') setPicked(null);
  }, [open]);
  // Close on success; on failure close too and say so (a toast would hide behind an open sheet).
  const run = (change: BookingChange, after?: () => void) =>
    update.mutate(
      { id: booking.id, change },
      {
        onSuccess: () => {
          onClose();
          after?.();
        },
        onError: () => {
          onClose();
          showToast("Couldn't update your service. Please try again.");
        },
      },
    );
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
        pending={update.isPending}
        onConfirm={() => run({ type: 'skip' })}
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
        pending={update.isPending}
        onConfirm={() => run({ type: 'cancel' }, () => router.back())}
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
            disabled={!quote || frequency === booking.frequency}
            loading={update.isPending}
            onPress={() => {
              const plan = quote?.plans.find((p) => p.frequency === frequency);
              if (plan) run({ type: 'frequency', frequency, price: plan.price });
            }}
          />
        </View>
      </BottomSheet>
      <BottomSheet visible={open === 'pause'} onClose={onClose} testID="pause-sheet" title="Pause for the season">
        {nextMonths().map((until) => (
          <Pressable key={until} testID={`pause-month-${until.slice(0, 7)}`} onPress={() => run({ type: 'pause', until })} className="border-b border-border py-4">
            <Text className="text-lg text-ink">{`${monthName(until)} ${until.slice(0, 4)}`}</Text>
          </Pressable>
        ))}
      </BottomSheet>
    </>
  );
}
