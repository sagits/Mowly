/** Sign up (P03, P04, P05): contact details and a category, then straight into the app. */
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { ScrollView, Text, View } from 'react-native';
import { useUpdatePro } from '@mowly/api';
import { useSession } from '@mowly/stores';
import { SignUpSchema } from '@mowly/types';
import { Button, FormField, Select, colors } from '@mowly/ui';
import { CATEGORY_LABEL, CORE_SKILLS } from '../src/content/coreSkills';

const OPTIONS = (Object.keys(CATEGORY_LABEL) as (keyof typeof CATEGORY_LABEL)[]).map((value) => ({ value, label: CATEGORY_LABEL[value] }));

/** The sign up form. */
export default function SignUpScreen() {
  const { mutateAsync: updatePro, isPending } = useUpdatePro();
  const { control, handleSubmit, formState } = useForm({
    resolver: zodResolver(SignUpSchema) as never,
    defaultValues: { zip: '', email: '', phone: '', category: undefined as 'lawn' | 'pool' | undefined },
  });
  const category = useWatch({ control, name: 'category' });
  const submit = handleSubmit(async (values) => {
    const { category: picked } = values as { category: 'lawn' | 'pool' };
    await updatePro({ category: picked });
    useSession.getState().signIn();
    router.replace('/');
  });

  return (
    <ScrollView testID="screen-sign-up" className="flex-1 bg-surface" contentContainerClassName="px-5 pb-10 pt-6" keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
      <Text className="mb-6 text-3xl font-semibold text-ink">Sign up to become a top Mowly partner</Text>
      <View className="gap-5">
        <FormField control={control} name="zip" label="Your zip code" testID="signup-zip" placeholder="e.g. 78701" keyboardType="number-pad" />
        <FormField control={control} name="email" label="Your email" testID="signup-email" placeholder="e.g. john@gmail.com" keyboardType="email-address" />
        <FormField control={control} name="phone" label="Your phone number" testID="signup-phone" placeholder="e.g. (555) 123-4567" keyboardType="phone-pad" />
        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <Select label="Select your category" testID="signup-category" placeholder="Select a category" value={field.value} options={OPTIONS} onChange={field.onChange} />
          )}
        />
        {formState.errors.category ? <Text testID="signup-category-error" className="text-caption text-danger">{formState.errors.category.message as string}</Text> : null}
      </View>
      {category ? (
        <View testID="core-skills" className="mt-5 overflow-hidden rounded-2xl border border-border">
          <View className="flex-row items-center gap-3 bg-border/40 px-4 py-4">
            <Ionicons name="bulb-outline" size={24} color={colors.ink} />
            <Text className="text-body-lg text-ink">Core skills needed</Text>
          </View>
          <View className="gap-3 px-4 py-4">
            {CORE_SKILLS[category].map((s) => (
              <Text key={s} className="text-body-lg text-ink">{`•  ${s}`}</Text>
            ))}
          </View>
        </View>
      ) : null}
      <Text className="mt-6 text-center text-caption text-inkSoft">
        By submitting my contact information, I agree that Mowly or its representatives may contact me by email, phone, or SMS at the email address or phone number I provide, including for marketing purposes and by automatic dialing systems. Message and data rates may apply. Message frequency varies. Text HELP for help. Text STOP to unsubscribe. I also agree to Mowly&apos;s terms of service and privacy policy.
      </Text>
      <Text className="my-5 text-center text-caption text-inkSoft">Consent is not a condition of service.</Text>
      <Button testID="signup-next" label="Next" onPress={submit} loading={isPending} />
    </ScrollView>
  );
}
