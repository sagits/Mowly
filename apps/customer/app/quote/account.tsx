/** Quote step 5: create your account with the demo card and BOOK NOW (C13-C15). */
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Redirect, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useCreateBooking, useQuote } from '@mowly/api';
import { AccountSchema, DEMO_CARD, type AccountInput } from '@mowly/types';
import { Checkbox, colors, FormField, Screen } from '@mowly/ui';
import { CostFooter } from '../../src/components/CostFooter';
import { costPerService } from '../../src/pricing';
import { missingStep, useQuoteDraft } from '../../src/stores/useQuoteDraft';

const POLICY = [
  "Tell us within 5 days if anything's off and we'll redo it or refund.",
  'Get free pro switches and quotes for additional services at any time.',
  'All new recurring plans need to commit to a 3-service minimum.',
];

/** The account step. */
export default function QuoteAccountScreen() {
  const router = useRouter();
  const { serviceId, contact, frequency, startDate, promoApplied } = useQuoteDraft();
  const { data: quote } = useQuote(serviceId, contact?.addressId ?? null);
  const { mutateAsync, isPending } = useCreateBooking();
  const sent = useRef(false);
  const [failed, setFailed] = useState(false);
  const { control, handleSubmit, formState } = useForm<AccountInput>({
    resolver: zodResolver(AccountSchema),
    mode: 'onChange',
    defaultValues: { firstName: '', lastName: '', email: '', cardNumber: DEMO_CARD, cardExpiry: '12 / 34', cardCvc: '123', acceptTerms: false as unknown as true },
  });
  const plan = quote?.plans.find((p) => p.frequency === frequency);

  const onBook = async () => {
    // a ref, because a second press can land before React re-renders with isPending
    if (sent.current || !plan || !serviceId || !frequency || !startDate || !contact) return;
    sent.current = true;
    setFailed(false);
    try {
      const { id } = await mutateAsync({ serviceId, frequency, price: costPerService(plan.price, promoApplied), startDate, addressId: contact.addressId });
      router.replace({ pathname: '/quote/booked', params: { id } });
    } catch {
      sent.current = false;
      setFailed(true);
    }
  };
  const book = () => handleSubmit(onBook)();
  const missing = missingStep({ serviceId, contact, frequency, startDate }, 'account');
  if (missing) return <Redirect href={missing} />;

  return (
    <Screen>
      <View testID="account-screen" className="flex-1">
        <ScrollView className="flex-1" contentContainerClassName="px-4 pb-6" keyboardShouldPersistTaps="handled">
          <Text className="mt-2 text-3xl font-bold text-ink">Create your account</Text>
          <View className="mt-6 gap-4">
            <View className="flex-row gap-3">
              <View className="flex-1"><FormField control={control} name="firstName" label="First name" testID="account-first" /></View>
              <View className="flex-1"><FormField control={control} name="lastName" label="Last name" testID="account-last" /></View>
            </View>
            <FormField control={control} name="email" label="Email address" testID="account-email" keyboardType="email-address" />
          </View>
          <View className="my-6 border-t border-border" />
          <View className="rounded-card border-2 border-border px-4 py-4">
            <View className="flex-row items-center">
              <Ionicons name="card-outline" size={28} color={colors.primary} />
              <Text className="ml-3 flex-1 text-xl font-semibold text-primary">Inspect First, Pay Later Promise</Text>
            </View>
            <Text className="mt-3 text-lg text-ink">
              Your card won&apos;t be charged for 3 full days after service, giving you time to inspect the work and ensure you&apos;re 100% satisfied.
            </Text>
          </View>
          <View className="mt-6 rounded-card border border-border px-4 py-4">
            <View className="gap-4">
              <FormField control={control} name="cardNumber" label="Card number" testID="account-card-number" keyboardType="number-pad" />
              <View className="flex-row gap-3">
                <View className="flex-1"><FormField control={control} name="cardExpiry" label="Expiration date" testID="account-card-expiry" /></View>
                <View className="flex-1"><FormField control={control} name="cardCvc" label="Security code" testID="account-card-cvc" keyboardType="number-pad" /></View>
              </View>
            </View>
            <Text className="mt-3 text-base font-semibold text-ink">Demo card, nothing is charged</Text>
            <Text className="mt-2 text-base text-muted">
              By providing your card information, you allow Mowly to charge your card for future payments in accordance with their terms.
            </Text>
          </View>
          <View className="mt-6">
            <Controller
              control={control}
              name="acceptTerms"
              render={({ field }) => (
                <Checkbox
                  testID="account-terms"
                  checked={field.value === true}
                  onChange={(v) => field.onChange(v)}
                  label={<Text className="flex-1 text-base text-ink">{'By checking you agree to our '}<Text className="text-link underline">Terms of Service</Text></Text>}
                />
              )}
            />
          </View>
          <View className="mt-6 overflow-hidden rounded-card border-2 border-border">
            <View className="border-b border-border px-4 py-3">
              <Ionicons name="pin-outline" size={24} color={colors.ink} />
            </View>
            <View className="gap-3 px-4 py-4">
              {POLICY.map((t) => (
                <View key={t} className="flex-row">
                  <Text className="mr-3 text-lg text-ink">•</Text>
                  <Text className="flex-1 text-lg text-ink">{t}</Text>
                </View>
              ))}
            </View>
          </View>
          <Pressable testID="account-faq-link" accessibilityRole="link" onPress={() => router.push('/quote/faq')} className="mt-8 items-center">
            <Text className="text-lg text-ink">
              Read our <Text className="text-link underline">Frequently Asked Questions</Text>
            </Text>
          </Pressable>
        </ScrollView>
        {failed ? (
          <Text testID="book-error" className="px-4 pb-2 text-center text-base text-danger">
            We couldn&apos;t book your service. Please try again.
          </Text>
        ) : null}
        <CostFooter
          testID="book-now"
          price={plan ? costPerService(plan.price, promoApplied) : 0}
          cta="Book now"
          disabled={!formState.isValid || !plan || isPending}
          loading={isPending}
          onPress={() => void book()}
        />
      </View>
    </Screen>
  );
}
