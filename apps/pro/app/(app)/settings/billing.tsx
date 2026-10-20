/** Billing (P20): the account balance and past claimed jobs. There are no payouts in a demo. */
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useBilling } from '@mowly/api';
import { formatMoney, formatShort } from '@mowly/types';
import { Card, colors } from '@mowly/ui';

const TABS = [
  { id: 'since-payout', label: 'Since last payout' },
  { id: 'all-time', label: 'All time' },
] as const;

/** The Billing screen. Both tabs list the same entries. */
export default function BillingScreen() {
  const { data: billing } = useBilling();
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('since-payout');
  if (!billing) return null;
  return (
    <ScrollView testID="screen-billing" className="flex-1 bg-pageMuted" contentContainerClassName="gap-4 p-4">
      <Card className="p-5">
        <Text className="text-sm uppercase tracking-widest text-inkPro">ACCOUNT BALANCE</Text>
        <Text testID="billing-balance" className="mt-2 text-5xl font-bold text-inkPro">{formatMoney(billing.balance)}</Text>
      </Card>
      <View className="flex-row items-center justify-between">
        <Text className="text-xl font-bold text-inkPro">Activity</Text>
        <Pressable testID="billing-filter" accessibilityRole="button" className="flex-row items-center gap-2">
          <Ionicons name="options-outline" size={20} color={colors.inkPro} />
          <Text className="text-base text-inkPro">Filter</Text>
        </Pressable>
      </View>
      <View className="flex-row">
        {TABS.map((t) => (
          <Pressable
            key={t.id}
            testID={`billing-${t.id}`}
            accessibilityRole="button"
            accessibilityState={{ selected: tab === t.id }}
            className={`flex-1 items-center rounded-full py-3 ${tab === t.id ? 'bg-surface' : ''}`}
            onPress={() => setTab(t.id)}
          >
            <Text className={`text-base text-inkPro ${tab === t.id ? 'font-semibold' : ''}`}>{t.label}</Text>
          </Pressable>
        ))}
      </View>
      {billing.entries.length === 0 ? (
        <Text testID="billing-empty" className="mt-4 text-center text-base text-inkPro">No billing activity yet.</Text>
      ) : (
        <Card>
          {billing.entries.map((e) => (
            <View key={e.jobId} testID={`billing-row-${e.jobId}`} className="flex-row items-center border-b border-border px-4 py-3">
              <View className="flex-1">
                <Text className="text-sm text-inkProBody">{formatShort(e.date)}</Text>
                <Text className="text-base text-inkPro">{e.description}</Text>
              </View>
              <Text className="text-base font-semibold text-inkPro">{formatMoney(e.amount)}</Text>
            </View>
          ))}
        </Card>
      )}
    </ScrollView>
  );
}
