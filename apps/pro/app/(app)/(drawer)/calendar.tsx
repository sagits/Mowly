/** Calendar (P11): the current month and the next, with each day's claimed job count. */
import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { useClaimedJobs } from '@mowly/api';
import { today } from '@mowly/types';
import { countsByDay } from '../../../src/calendar';
import { MonthGrid } from '../../../src/components/MonthGrid';
import { ScreenLoading } from '../../../src/components/ScreenLoading';

/** The Calendar screen. */
export default function CalendarScreen() {
  const { data: jobs = [], isPending } = useClaimedJobs();
  const counts = countsByDay(jobs);
  const [y = 0, m = 1] = today().split('-').map(Number);
  const months = [new Date(y, m - 1, 1), new Date(y, m, 1)];
  return (
    <View testID="screen-calendar" className="flex-1 bg-pageMuted">
      {/* No grid until the counts load: an empty month would read as "no jobs". */}
      {isPending ? (
        <ScreenLoading rows={6} />
      ) : (
        <ScrollView>
          {months.map((d) => (
            <MonthGrid
              key={d.getMonth()}
              year={d.getFullYear()}
              month0={d.getMonth()}
              counts={counts}
              onPressDay={(date) => router.push(`/calendar/${date}`)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
