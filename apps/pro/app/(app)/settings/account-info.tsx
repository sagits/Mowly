/** Account info editor. */
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { ScrollView, View } from 'react-native';
import { usePro, useUpdatePro } from '@mowly/api';
import type { Pro } from '@mowly/types';
import { AccountInfoSchema } from '@mowly/types';
import { Button, FormField, showToast } from '@mowly/ui';
import { ScreenLoading } from '../../../src/components/ScreenLoading';

/** Renders once the Pro has loaded, so the form starts from the saved values. */
export default function AccountInfoScreen() {
  const { data: pro } = usePro();
  return pro ? <AccountInfoBody pro={pro} /> : <ScreenLoading />;
}

function AccountInfoBody({ pro }: { pro: Pro }) {
  const { mutateAsync: updatePro, isPending } = useUpdatePro();
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(AccountInfoSchema) as never,
    defaultValues: { firstName: pro.firstName, lastName: pro.lastName, mobilePhone: pro.mobilePhone, email: pro.email },
  });

  const save = handleSubmit(async (values) => {
    await updatePro(values);
    showToast('Saved');
    router.back();
  });

  return (
    <View testID="screen-account-info" className="flex-1 bg-surface">
      <ScrollView contentContainerClassName="gap-4 p-5" keyboardShouldPersistTaps="handled">
        <FormField control={control} name="firstName" label="First name" testID="ai-first" />
        <FormField control={control} name="lastName" label="Last name" testID="ai-last" />
        <FormField control={control} name="mobilePhone" label="Mobile phone" testID="ai-phone" keyboardType="phone-pad" />
        <FormField control={control} name="email" label="Email" testID="ai-email" keyboardType="email-address" />
      </ScrollView>
      <View className="px-5 pb-8">
        <Button testID="ai-save" label="Save" variant="orange" loading={isPending} onPress={save} />
      </View>
    </View>
  );
}
