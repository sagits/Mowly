/** One claimed job (invented): who, where, what, how much, and the way to recommend another service. */
import { router, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { useJob } from '@mowly/api';
import { formatLong, formatMoney, FREQUENCY_LABELS } from '@mowly/types';
import { Button } from '@mowly/ui';
import { ScreenLoading } from '../../../../src/components/ScreenLoading';

/** Shows the job in the `id` param. */
export default function JobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: job } = useJob(id);
  if (!job) return <ScreenLoading />;
  const { line1, city, state, zip } = job.address;
  return (
    <View testID="screen-job" className="flex-1 gap-1 bg-surface p-5">
      <Text className="text-2xl font-bold text-inkPro">{job.customerName}</Text>
      <Text className="text-lg text-inkPro">{line1}</Text>
      <Text className="text-lg text-inkPro">{`${city}, ${state} ${zip}`}</Text>
      {job.claimedDate && <Text className="mt-3 text-lg font-semibold text-accent">{formatLong(job.claimedDate)}</Text>}
      <View className="mt-3 flex-row items-center justify-between">
        <Text className="text-lg font-semibold text-primary">{`${job.serviceName}, ${FREQUENCY_LABELS[job.frequency]}`}</Text>
        <Text className="text-xl font-bold text-primary">{formatMoney(job.price)}</Text>
      </View>
      <Text className="mt-3 text-base font-semibold text-inkPro">Notes</Text>
      <Text className="text-base text-inkProBody">{job.notes}</Text>
      <View className="mt-6">
        <Button testID="job-recommend" label="Recommend a service" onPress={() => router.push(`/jobs/${id}/recommend`)} />
      </View>
    </View>
  );
}
