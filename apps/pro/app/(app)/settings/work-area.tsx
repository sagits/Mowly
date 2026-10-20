/** Set up your work area (P21). The pencils are inert: editing days and addresses is out of scope. */
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { usePro, useUpdatePro } from '@mowly/api';
import type { Pro } from '@mowly/types';
import { Button, colors, Radio } from '@mowly/ui';

export default function WorkAreaScreen() {
  const { data: pro } = usePro();
  return pro ? <WorkAreaBody pro={pro} /> : <View testID="screen-work-area" className="flex-1 bg-surface" />;
}

function WorkAreaBody({ pro }: { pro: Pro }) {
  const { mutateAsync: updatePro, isPending } = useUpdatePro();
  const [mode, setMode] = useState(pro.workAreaMode);
  const a = pro.startingPoint;
  return (
    <View testID="screen-work-area" className="flex-1 bg-surface">
      <View className="flex-1 gap-4 p-5">
        <Text className="text-2xl font-bold text-inkPro">Set your work area</Text>
        <Text className="text-base text-inkProBody">
          Choose where you'll begin your day. Tell us your starting point so we can find you the best jobs nearby.
        </Text>
        <Text className="mt-2 text-xl font-bold text-inkPro">Main Crew</Text>
        <View className="flex-row items-center gap-3 border-y border-border py-4">
          <Ionicons name="calendar" size={22} color={colors.primary} />
          <Text className="flex-1 text-base font-bold text-inkPro">General work days</Text>
          <Text className="text-base text-inkProBody">Mon-Sun</Text>
          <Ionicons name="pencil" size={20} color={colors.primary} />
        </View>
        <Radio testID="work-area-one" label="One starting point for all work days" selected={mode === 'one'} onPress={() => setMode('one')} />
        <View className="ml-9 flex-row items-center">
          <Text className="flex-1 text-base text-inkPro">{`${a.line1},\n${a.city}, ${a.state} ${a.zip}`}</Text>
          <Ionicons name="pencil" size={20} color={colors.primary} />
        </View>
        <Radio testID="work-area-by-day" label="Different starting points by work day" selected={mode === 'by-day'} onPress={() => setMode('by-day')} />
      </View>
      <View className="px-5 pb-8">
        <Button
          testID="work-area-save"
          label="Save"
          loading={isPending}
          onPress={async () => {
            await updatePro({ workAreaMode: mode, workAreaSaved: true });
            router.back();
          }}
        />
      </View>
    </View>
  );
}
