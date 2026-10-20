/** Business profile (P16). */
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { usePro, useUpdatePro } from '@mowly/api';
import type { Pro } from '@mowly/types';
import { BusinessProfileSchema } from '@mowly/types';
import { AVATARS, Button, FormField, colors, showToast } from '@mowly/ui';
import { AvatarSheet } from '../../../src/components/AvatarSheet';

/** Renders once the Pro has loaded, so the form starts from the saved values. */
export default function BusinessProfileScreen() {
  const { data: pro } = usePro();
  return pro ? <BusinessProfileBody pro={pro} /> : null;
}

function Circle({ testID, label, photo, onPress }: { testID: string; label: string; photo: number | null; onPress: () => void }) {
  return (
    <View className="items-center gap-2">
      <Pressable testID={testID} accessibilityRole="button" accessibilityLabel={label} onPress={onPress} className="h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-surfaceMuted">
        {photo === null ? <Ionicons name="camera-outline" size={40} color="white" /> : <Image source={AVATARS[photo]} className="h-28 w-28" />}
      </Pressable>
      <Text className="text-sm text-inkProBody">{label}</Text>
    </View>
  );
}

function BusinessProfileBody({ pro }: { pro: Pro }) {
  const { mutateAsync: updatePro, isPending } = useUpdatePro();
  const [avatar, setAvatar] = useState(pro.avatar);
  const [truck, setTruck] = useState(pro.truckPhoto);
  const [sheet, setSheet] = useState<'photo' | 'truck' | null>(null);
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(BusinessProfileSchema) as never,
    defaultValues: { companyName: pro.businessName, officePhone: pro.officePhone, businessAddress: pro.businessAddress, bio: pro.bio },
  });
  const bio = useWatch({ control, name: 'bio' }) ?? '';

  const save = handleSubmit(async ({ companyName, officePhone, businessAddress, bio: text }) => {
    await updatePro({ businessName: companyName, officePhone, businessAddress, bio: text, avatar, truckPhoto: truck });
    showToast('Saved');
    router.back();
  });

  return (
    <View testID="screen-business-profile" className="flex-1 bg-surface">
      <ScrollView contentContainerClassName="gap-4 p-5" keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
        <View className="flex-row justify-around">
          <Circle testID="bp-photo" label="Profile photo" photo={avatar} onPress={() => setSheet('photo')} />
          <Circle testID="bp-truck" label="Truck photo" photo={truck} onPress={() => setSheet('truck')} />
        </View>
        <Text className="text-sm font-semibold text-accent">NEW! Add photos and a bio so customers get to know you.</Text>
        <FormField control={control} name="companyName" label="Company name" testID="bp-company" />
        <FormField control={control} name="officePhone" label="Office phone" testID="bp-office-phone" keyboardType="phone-pad" />
        <FormField
          control={control}
          name="businessAddress"
          label="Business address"
          testID="bp-address"
          right={<Ionicons name="location-outline" size={20} color={colors.primary} />}
        />
        <FormField control={control} name="bio" label="Help customers get to know you" placeholder="Explain when and why you started your business, what makes your business great, and who you are!" testID="bp-bio" multiline maxLength={250} />
        <Text testID="bp-bio-count" className="text-right text-sm text-inkProBody">{`${bio.length}/250`}</Text>
      </ScrollView>
      <View className="px-5 pb-8">
        <Button testID="bp-save" label="Save" variant="orange" loading={isPending} onPress={save} />
      </View>
      <AvatarSheet
        visible={sheet !== null}
        onClose={() => setSheet(null)}
        onPick={(i) => {
          (sheet === 'truck' ? setTruck : setAvatar)(i);
          setSheet(null);
        }}
      />
    </View>
  );
}
