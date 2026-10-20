/** Provide tax info (P18). The SSN field is shown but never collected. */
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, Text, View } from 'react-native';
import { usePro, useUpdatePro } from '@mowly/api';
import type { Pro, TaxInfo } from '@mowly/types';
import { TaxInfoSchema } from '@mowly/types';
import { Badge, Button, FormField, Select, TextField } from '@mowly/ui';

const ENTITIES: { value: TaxInfo['entityType']; label: string }[] = [
  { value: 'individual', label: 'Individual' },
  { value: 'llc', label: 'LLC' },
  { value: 'corporation', label: 'Corporation' },
];

type Values = Partial<TaxInfo>;

/** Renders once the Pro has loaded, so the form starts from the saved values. */
export default function TaxInfoScreen() {
  const { data: pro } = usePro();
  return pro ? <TaxInfoBody pro={pro} /> : null;
}

function TaxInfoBody({ pro }: { pro: Pro }) {
  const { mutateAsync: updatePro, isPending } = useUpdatePro();
  const { control, handleSubmit } = useForm<Values>({
    resolver: zodResolver(TaxInfoSchema) as never,
    defaultValues: pro.taxInfo ?? { legalName: '', dateOfBirth: '', legalAddress: '' },
  });

  const save = handleSubmit(async (values) => {
    await updatePro({ taxInfo: values as TaxInfo });
    router.back();
  });

  return (
    <View testID="screen-tax-info" className="flex-1 bg-surface">
      <ScrollView contentContainerClassName="gap-4 p-5" keyboardShouldPersistTaps="handled">
        <Text className="text-2xl font-bold text-inkPro">Provide tax info</Text>
        <View className="flex-row items-center justify-between">
          <Text className="text-xl font-semibold text-inkPro">Tax info</Text>
          <Badge label="Secured" tone="gray" testID="tax-secured" />
        </View>
        <Text className="text-base text-inkProBody">
          The following information will allow us to verify your business and ensures you’ll get important tax documents so you are prepared for tax season.
        </Text>
        <Controller
          control={control}
          name="entityType"
          render={({ field, fieldState }) => (
            <View>
              <Select label="Legal Entity Type" testID="tax-entity" value={field.value} options={ENTITIES} onChange={field.onChange} />
              {fieldState.error ? <Text testID="tax-entity-error" className="mt-1 text-sm text-danger">{fieldState.error.message}</Text> : null}
            </View>
          )}
        />
        <FormField control={control} name="legalName" label="Legal Name" testID="tax-legal-name" placeholder="As it appears on your tax return" />
        <FormField control={control} name="dateOfBirth" label="Date of birth" testID="tax-dob" placeholder="MM/DD/YYYY" keyboardType="number-pad" maxLength={10} />
        <View>
          <TextField label="Social Security Number (SSN)" testID="tax-ssn" value="" onChangeText={() => {}} editable={false} placeholder="XXX-XX-XXXX" />
          <Text className="mt-1 text-sm text-inkProBody">Not collected in this demo</Text>
        </View>
        <FormField control={control} name="legalAddress" label="Legal Address" testID="tax-address" />
      </ScrollView>
      <View className="px-5 pb-8">
        <Button testID="tax-save" label="Save" variant="orange" loading={isPending} onPress={save} />
      </View>
    </View>
  );
}
