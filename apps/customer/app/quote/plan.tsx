/** Quote step 4: pick a frequency, start date and promo (C08-C12). */
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useQuote, useService } from '@mowly/api';
import { nextWeekday } from '@mowly/types';
import { colors, Screen, Skeleton } from '@mowly/ui';
import { CostFooter } from '../../src/components/CostFooter';
import { DateSheet, formatPlanDate } from '../../src/components/DateSheet';
import { FunnelHeader } from '../../src/components/FunnelHeader';
import { PlanRow } from '../../src/components/PlanRow';
import { PromoSheet } from '../../src/components/PromoSheet';
import { costPerService } from '../../src/pricing';
import { useQuoteDraft } from '../../src/stores/useQuoteDraft';

/** The plan step. */
export default function QuotePlanScreen() {
  const router = useRouter();
  const { serviceId, contact, frequency, startDate, promoApplied } =
    useQuoteDraft();
  const { choosePlan, setStartDate, applyPromo } = useQuoteDraft.getState();
  const { data: service } = useService(serviceId ?? '');
  const { data: quote } = useQuote(serviceId, contact?.addressId ?? null);
  const [dateOpen, setDateOpen] = useState(false);
  const [promoOpen, setPromoOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!quote) return;
    if (!frequency)
      choosePlan(
        quote.plans.find((p) => p.recommended)?.frequency ??
          quote.plans[0]!.frequency,
      );
    if (!startDate) setStartDate(nextWeekday());
  }, [quote, frequency, startDate, choosePlan, setStartDate]);

  const chosen = quote?.plans.find((p) => p.frequency === frequency);
  const name = service?.name ?? '';

  return (
    <Screen>
      <View testID="plan-screen" className="flex-1">
        <FunnelHeader />
        {!quote ? (
          <View testID="plan-loading" className="flex-1 px-4 pt-8">
            <Skeleton className="mb-4 h-10 w-3/4" />
            <Skeleton className="mb-8 h-12 w-full" />
            <Skeleton className="mb-3 h-16 w-full" />
            <Skeleton className="mb-3 h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </View>
        ) : (
          <ScrollView className="flex-1" contentContainerClassName="px-4 pb-6">
            <Text className="mt-6 text-3xl font-bold text-inkPro">{`Pick your ${name} plan`}</Text>
            <Text className="mb-8 mt-4 text-lg text-muted">
              Select the frequency for your following services, you can always
              change this later.
            </Text>
            <View className="gap-3">
              {quote.plans.map((p) => (
                <PlanRow
                  key={p.frequency}
                  testID={`plan-row-${p.frequency}`}
                  plan={p}
                  selected={p.frequency === frequency}
                  onPress={() => choosePlan(p.frequency)}
                />
              ))}
            </View>
            <Text className="mb-2 mt-10 text-lg text-ink">
              Preferred start date
            </Text>
            <Pressable
              testID="plan-start-date"
              onPress={() => setDateOpen(true)}
              className="rounded-field border border-border px-4 py-5"
            >
              <Text className="text-lg text-ink">
                {startDate ? formatPlanDate(startDate) : ''}
              </Text>
            </Pressable>
            <Pressable
              testID="promo-open"
              onPress={() => setPromoOpen(true)}
              className="mt-10 items-center"
            >
              {promoApplied ? (
                <Text
                  testID="promo-applied"
                  className="text-lg font-bold uppercase text-primary"
                >
                  Code applied
                </Text>
              ) : (
                <Text className="text-lg font-bold uppercase text-primary">
                  Add a promo code
                </Text>
              )}
            </Pressable>
            <View className="my-8 border-t border-border" />
            <View className="overflow-hidden rounded-card border-2 border-callout">
              <View className="flex-row items-center bg-callout px-4 py-4">
                <Ionicons name="bulb-outline" size={28} color={colors.inkPro} />
                <Text className="ml-4 text-xl text-inkPro">
                  What's included?
                </Text>
              </View>
              <View className="flex-row px-4 py-4">
                <Text className="mr-3 text-lg text-inkPro">•</Text>
                <Text className="flex-1 text-lg text-inkPro">
                  {service?.included ?? ''}
                </Text>
              </View>
            </View>
            <Text className="mt-12 text-center text-xl text-inkPro">Have additional questions?</Text>
            <Pressable testID="plan-faq-link" onPress={() => router.push('/quote/faq')} className="items-center">
              <Text className="text-xl text-inkPro">
                Read our <Text className="text-link underline">Frequently Asked Questions</Text>
              </Text>
            </Pressable>
            <Pressable testID="plan-not-looking" onPress={() => router.replace('/quote')} className="mt-12 items-center">
              <Text className="text-xl text-link underline">{`I'm not looking for ${name}`}</Text>
            </Pressable>
          </ScrollView>
        )}
        <CostFooter
          testID="quote-continue"
          price={chosen ? costPerService(chosen.price, promoApplied) : 0}
          cta="Continue"
          disabled={!chosen}
          loading={busy}
          onPress={() => {
            setBusy(true);
            // ponytail: nothing to wait for; the delay only shows the spinner of C12
            setTimeout(() => router.push('/quote/account'), 800);
          }}
        />
        <DateSheet
          testID="date-sheet"
          visible={dateOpen}
          onClose={() => setDateOpen(false)}
          value={startDate}
          onPick={setStartDate}
        />
        <PromoSheet
          visible={promoOpen}
          onClose={() => setPromoOpen(false)}
          onApplied={applyPromo}
        />
      </View>
    </Screen>
  );
}
