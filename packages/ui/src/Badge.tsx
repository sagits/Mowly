/** A small chip for statuses and counts. */
import { Text, View } from 'react-native';

type Tone = 'green' | 'gray' | 'orange';

const GROUND: Record<Tone, string> = {
  green: 'bg-primary',
  gray: 'bg-surfaceMuted',
  orange: 'bg-accent',
};
const INK: Record<Tone, string> = { green: 'text-surface', gray: 'text-muted', orange: 'text-surface' };

/** The "Scheduled" chip, and the numeric badge too. The label carries the meaning; the tone is decoration. */
export function Badge({ label, tone = 'green', testID }: { label: string; tone?: Tone; testID?: string }) {
  return (
    <View testID={testID} className={`self-start rounded-full px-2.5 py-1 ${GROUND[tone]}`}>
      <Text className={`text-caption font-semibold ${INK[tone]}`}>{label}</Text>
    </View>
  );
}
