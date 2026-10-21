/** The Dashboard (P06): the onboarding checklist, unlocked one row at a time. */
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAvailableJobs, usePro, useTodayRoute } from '@mowly/api';
import { formatMoney } from '@mowly/types';
import { colors, Spinner } from '@mowly/ui';
import { CHECKLIST, checklistDone, rowStates, type ChecklistItem } from '../../../src/checklist';
import { ChecklistRow } from '../../../src/components/ChecklistRow';

const GROUPS: { group: ChecklistItem['group']; title: string }[] = [
  { group: 'profile', title: 'Build a winning profile' },
  { group: 'paid', title: 'Set up to get paid' },
];

/** Shown instead of the checklist once all 8 steps are done: today's route and the top 3 available jobs. */
function AfterChecklist() {
  const { data: stops } = useTodayRoute();
  const { data: jobs } = useAvailableJobs();
  return (
    <>
      <View testID="checklist-complete" className="mt-6 flex-row items-center gap-3 rounded-card border border-border px-5 py-4">
        <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
        <Text className="text-body font-bold text-primary">{"You're all set."}</Text>
      </View>
      <Text className="mb-2 mt-8 px-1 text-body font-bold text-inkPro">{"Today's route"}</Text>
      <Pressable testID="dash-route" accessibilityRole="button" onPress={() => router.push('/route')} className="gap-1 rounded-card border border-border px-5 py-4">
        {stops && stops.length > 0 ? (
          <>
            <Text className="text-body font-semibold text-primary">{`${stops.length} ${stops.length === 1 ? 'stop' : 'stops'} today`}</Text>
            <Text className="text-body text-inkProBody">{`First: ${stops[0]!.address.line1}`}</Text>
          </>
        ) : (
          <Text className="text-body text-inkProBody">{stops ? 'No jobs on your route today.' : ' '}</Text>
        )}
      </Pressable>
      <Text className="mb-2 mt-8 px-1 text-body font-bold text-inkPro">Available jobs near you</Text>
      {(jobs ?? []).slice(0, 3).map((job) => (
        <Pressable
          key={job.id}
          testID={`dash-job-${job.id}`}
          accessibilityRole="button"
          onPress={() => router.navigate('/jobs')}
          className="mb-3 gap-1 rounded-card border border-border px-5 py-4"
        >
          <View className="flex-row justify-between">
            <Text className="text-body font-semibold text-primary">{job.serviceName}</Text>
            <Text className="text-body font-bold text-primary">{formatMoney(job.price)}</Text>
          </View>
          <Text className="text-body text-inkProBody">{job.address.line1}</Text>
        </Pressable>
      ))}
    </>
  );
}

/** The Dashboard screen. */
export default function DashboardScreen() {
  const { data: pro } = usePro();
  if (!pro) return <View testID="screen-dashboard" className="flex-1 items-center justify-center bg-surface"><Spinner /></View>;
  const states = rowStates(checklistDone(pro));
  const allDone = Object.values(states).every((v) => v === 'done');
  return (
    <ScrollView testID="screen-dashboard" className="flex-1 bg-surface" contentContainerClassName="p-4 pb-10">
      <View className="rounded-card border border-border px-5 py-4">
        <Text className="text-body text-inkPro">{`${pro.customersServed} customers served in ${pro.city}, ${pro.startingPoint.state}`}</Text>
      </View>
      <Text className="mt-6 text-title-sm text-inkPro">{`Welcome, ${pro.firstName}`}</Text>
      {allDone ? <AfterChecklist /> : (
        <>
      <Text className="mt-3 text-body text-inkProBody">Complete your account (Profile first, then payments):</Text>
      {GROUPS.map(({ group, title }) => (
        <View key={group} className="mt-8">
          <Text className="mb-2 px-1 text-body font-bold text-inkPro">{title}</Text>
          <View className="border-t border-primaryTint">
            {CHECKLIST.filter((i) => i.group === group).map((item) => (
              <ChecklistRow key={item.id} item={item} state={states[item.id]} onPress={() => router.push(item.href)} />
            ))}
          </View>
        </View>
      ))}
        </>
      )}
    </ScrollView>
  );
}
