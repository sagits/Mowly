/** The Dashboard (P06): the onboarding checklist, unlocked one row at a time. */
import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { usePro } from '@mowly/api';
import { Spinner } from '@mowly/ui';
import { CHECKLIST, checklistDone, rowStates, type ChecklistItem } from '../../src/checklist';
import { ChecklistRow } from '../../src/components/ChecklistRow';

const GROUPS: { group: ChecklistItem['group']; title: string }[] = [
  { group: 'profile', title: 'Build a winning profile' },
  { group: 'paid', title: 'Set up to get paid' },
];

/** The Dashboard screen. */
export default function DashboardScreen() {
  const { data: pro } = usePro();
  if (!pro) return <View testID="screen-dashboard" className="flex-1 items-center justify-center bg-surface"><Spinner /></View>;
  const states = rowStates(checklistDone(pro));
  return (
    <ScrollView testID="screen-dashboard" className="flex-1 bg-surface" contentContainerClassName="p-4 pb-10">
      <View className="rounded-card border border-border px-5 py-4">
        <Text className="text-body text-inkPro">{`${pro.customersServed} customers served in ${pro.city}, ${pro.startingPoint.state}`}</Text>
      </View>
      <Text className="mt-6 text-title-sm text-inkPro">{`Welcome, ${pro.firstName}`}</Text>
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
    </ScrollView>
  );
}
