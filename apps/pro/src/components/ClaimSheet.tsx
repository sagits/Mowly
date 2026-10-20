/** The sheet that confirms claiming one date of a job. */
import { useRef } from 'react';
import { Text, View } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys, useClaimJob } from '@mowly/api';
import { formatMoney, formatShort, FREQUENCY_LABELS, weekdayShort } from '@mowly/types';
import type { IsoDate, Job } from '@mowly/types';
import { BottomSheet, Button, showToast } from '@mowly/ui';

/** CLAIM JOB claims once: the ref blocks a second press made before `isPending` has rendered. */
export function ClaimSheet({ job, date, visible, onClose }: { job: Job | null; date: IsoDate | null; visible: boolean; onClose: () => void }) {
  const { mutateAsync, isPending } = useClaimJob();
  const qc = useQueryClient();
  const busy = useRef(false);
  const claim = async () => {
    if (busy.current || !job || !date) return;
    busy.current = true;
    try {
      await mutateAsync({ id: job.id, date });
      showToast('Job claimed');
    } catch {
      // The hook only refetches on success; drop the stale job from the map and pager.
      await qc.invalidateQueries({ queryKey: queryKeys.jobs });
      showToast('This job was already claimed');
    } finally {
      busy.current = false;
      onClose();
    }
  };
  return (
    <BottomSheet visible={visible} onClose={onClose} testID="claim-sheet" title="Claim this job">
      {job && date ? (
        <View className="gap-1">
          <Text className="text-base text-inkPro">{`${job.address.line1}, ${job.address.city}`}</Text>
          <Text className="text-base text-inkPro">{`${job.serviceName}, ${FREQUENCY_LABELS[job.frequency]}`}</Text>
          <Text className="text-base font-semibold text-accent">{`${weekdayShort(date)}, ${formatShort(date)}`}</Text>
          <Text className="mb-4 text-xl font-bold text-primary">{formatMoney(job.price)}</Text>
          <Button testID="claim-confirm" label="Claim job" loading={isPending} onPress={claim} />
        </View>
      ) : null}
    </BottomSheet>
  );
}
