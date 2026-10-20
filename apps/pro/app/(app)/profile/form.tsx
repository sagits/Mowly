/** Build a profile, form (P09). */
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { usePro, useUpdatePro } from '@mowly/api';
import type { Pro } from '@mowly/types';
import { BuildProfileSchema } from '@mowly/types';
import { AVATARS, Button, FormField } from '@mowly/ui';
import { AvatarSheet } from '../../../src/components/AvatarSheet';

type Values = { businessName: string; yearFounded: string; crewSize: string };

/** Renders once the Pro has loaded, so the form starts from the saved values (an edit must not wipe the avatar). */
export default function ProfileForm() {
  const { data: pro } = usePro();
  return pro ? <ProfileFormBody pro={pro} /> : null;
}

function ProfileFormBody({ pro }: { pro: Pro }) {
  const { mutateAsync: updatePro, isPending } = useUpdatePro();
  const [avatar, setAvatar] = useState<number | null>(pro.avatar);
  const [sheet, setSheet] = useState(false);
  const { control, handleSubmit } = useForm<Values>({
    resolver: zodResolver(BuildProfileSchema) as never,
    defaultValues: { businessName: pro.businessName, yearFounded: pro.yearFounded, crewSize: pro.crewSize > 0 ? String(pro.crewSize) : '' },
  });

  const save = handleSubmit(async ({ businessName, yearFounded, crewSize }) => {
    await updatePro({ businessName, yearFounded, crewSize: Number(crewSize), avatar });
    // Pop the form and the intro, back to whoever opened the intro.
    router.dismiss(2);
  });

  return (
    <View className="flex-1 bg-surface">
      <ScrollView contentContainerClassName="gap-4 p-5" keyboardShouldPersistTaps="handled">
        <Text className="text-2xl font-bold text-inkPro">Build a winning profile</Text>
        <Text className="text-base text-inkProBody">Customers will see this information when you’re assigned to the job.</Text>
        <FormField control={control} name="businessName" label="Business name" testID="profile-business" />
        <FormField control={control} name="yearFounded" label="Year founded" testID="profile-year" keyboardType="number-pad" />
        <FormField control={control} name="crewSize" label="Number of crew(s)" testID="profile-crew" placeholder="Number of crew(s)" keyboardType="number-pad" />
        <Text className="text-label text-inkPro">Upload a clear headshot photo</Text>
        <Text className="text-sm text-inkProBody">A profile photo can help build trust and rapport with your customers.</Text>
        <Pressable
          testID="profile-headshot"
          accessibilityRole="button"
          accessibilityLabel="Add headshot"
          onPress={() => setSheet(true)}
          className="h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-surfaceMuted"
        >
          {avatar === null ? (
            <Ionicons name="camera-outline" size={40} color="white" />
          ) : (
            <Image source={AVATARS[avatar]} className="h-28 w-28" />
          )}
        </Pressable>
      </ScrollView>
      <View className="px-5 pb-8">
        <Button testID="profile-continue" label="Continue" onPress={save} loading={isPending} />
      </View>
      <AvatarSheet visible={sheet} onClose={() => setSheet(false)} onPick={(i) => { setAvatar(i); setSheet(false); }} />
    </View>
  );
}
