/** Quote funnel step 2: contact details with address autocomplete (C04-C06). */
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Redirect, useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, Text, View } from 'react-native';
import { useCustomer, useService } from '@mowly/api';
import { Button, colors, FormField, Screen, Spinner } from '@mowly/ui';
import { QuoteContactSchema, type QuoteContactInput } from '@mowly/types';
import { AddressAutocomplete } from '../../src/components/AddressAutocomplete';
import { FunnelHeader } from '../../src/components/FunnelHeader';
import { missingStep, useQuoteDraft } from '../../src/stores/useQuoteDraft';

/** The quote form step. */
export default function QuoteDetailsScreen() {
  const { data: customer } = useCustomer();
  const draft = useQuoteDraft((s) => s.contact);
  const missing = useQuoteDraft((s) => missingStep(s, 'details'));
  if (missing) return <Redirect href={missing} />;
  if (!customer) return <Spinner testID="details-spinner" />;
  const a = customer.address;
  return (
    <DetailsForm
      defaults={
        draft ?? {
          name: customer.name,
          addressId: a.id,
          addressText: `${a.line1}, ${a.city}, ${a.state} ${a.zip}`,
          apt: '',
          phone: customer.phone,
        }
      }
    />
  );
}

function DetailsForm({ defaults }: { defaults: QuoteContactInput }) {
  const router = useRouter();
  const serviceId = useQuoteDraft((s) => s.serviceId);
  const setContact = useQuoteDraft((s) => s.setContact);
  const { data: service } = useService(serviceId ?? '');
  const { control, handleSubmit, setValue, formState } = useForm<QuoteContactInput>({
    resolver: zodResolver(QuoteContactSchema),
    defaultValues: defaults,
  });
  const { errors } = formState;

  return (
    <Screen>
      <FunnelHeader />
      <ScrollView className="flex-1" contentContainerClassName="px-4 pb-6" keyboardShouldPersistTaps="handled">
        <Text className="mt-6 text-3xl font-bold text-ink">{`Let's get your ${service?.name ?? ''} quote`}</Text>
        <Text className="mb-5 mt-4 text-lg text-muted">We need some details to provide a price estimate.</Text>
        <View className="gap-4">
          <FormField control={control} name="name" label="Name" testID="quote-name" />
          <Controller
            control={control}
            name="addressText"
            render={({ field }) => (
              <AddressAutocomplete
                testID="quote-address"
                value={field.value}
                error={errors.addressId?.message ?? errors.addressText?.message}
                onChangeText={(text) => {
                  field.onChange(text);
                  setValue('addressId', '');
                }}
                onPick={(a) => {
                  field.onChange(`${a.line1}, ${a.city}, ${a.state} ${a.zip}`);
                  setValue('addressId', a.id, { shouldValidate: true });
                }}
              />
            )}
          />
          <FormField control={control} name="apt" label="Apt, suite, etc. (optional)" testID="quote-apt" />
          <FormField control={control} name="phone" label="Phone" testID="quote-phone" keyboardType="phone-pad" />
        </View>
        <View className="mt-5 border-t border-border" />
        <Text className="mt-5 text-center text-sm text-muted">
          {'By clicking continue, you agree to our '}
          <Text className="text-link underline">terms of service</Text>
          {' and '}
          <Text className="text-link underline">privacy policy</Text>
          {', and to receive calls and texts about your quote.'}
        </Text>
        <View className="mt-5 flex-row items-center justify-center">
          <Ionicons name="lock-closed" size={18} color={colors.ink} />
          <Text className="ml-2 text-base text-ink">Your information is safe &amp; secure</Text>
        </View>
      </ScrollView>
      <View className="px-4 pb-6 pt-3">
        <Button
          testID="quote-continue"
          label="Continue"
          onPress={handleSubmit((contact) => {
            setContact(contact);
            router.push('/quote/sizing');
          })}
        />
      </View>
    </Screen>
  );
}
