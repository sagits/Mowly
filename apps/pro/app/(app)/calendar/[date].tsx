/** The jobs of one day (invented): a row per job, plus today's route entry. */
import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { useClaimedJobs } from '@mowly/api';
import { formatMoney, today } from '@mowly/types';
import type { IsoDate } from '@mowly/types';
import { Button, ListRow } from '@mowly/ui';
import { ScreenLoading } from '../../../src/components/ScreenLoading';

/** Lists the jobs claimed for the `date` param. */
export default function DayScreen() {
  const { date } = useLocalSearchParams<{ date: IsoDate }>();
  const { data: jobs = [], isPending } = useClaimedJobs();
  const day = jobs.filter((j) => j.claimedDate === date);
  return (
    <View testID="screen-day" className="flex-1 bg-surface">
      {isPending && <ScreenLoading rows={3} />}
      {day.map((job) => (
        <ListRow
          key={job.id}
          testID={`day-job-${job.id}`}
          title={job.address.line1}
          subtitle={`${job.serviceName}, ${formatMoney(job.price)}`}
          onPress={() => router.push(`/jobs/${job.id}`)}
        />
      ))}
      {date === today() && (
        <View className="p-5">
          <Button testID="day-view-route" label="View route" onPress={() => router.push('/route')} />
        </View>
      )}
    </View>
  );
}
