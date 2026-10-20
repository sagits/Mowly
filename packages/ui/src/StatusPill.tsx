/** A status as a pill: a label on a tinted ground. The label carries the status; the color is decoration only. */
import { Text, View } from 'react-native';

/** Placeholder lifecycle until the Mowly domain types land. */
type JobStatus = 'open' | 'claimed' | 'done';

const PILLS: Record<JobStatus, { label: string; ground: string; ink: string }> = {
  open: { label: 'Open', ground: 'bg-openGround', ink: 'text-accent' },
  claimed: { label: 'Claimed', ground: 'bg-claimedGround', ink: 'text-warning' },
  done: { label: 'Done', ground: 'bg-doneGround', ink: 'text-primaryInk' },
};

export function StatusPill({ status }: { status: JobStatus }) {
  const pill = PILLS[status];

  return (
    <View className={`rounded-card px-2.5 py-1 ${pill.ground}`}>
      <Text className={`text-[13px] font-semibold ${pill.ink}`}>{pill.label}</Text>
    </View>
  );
}
