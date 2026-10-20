/** Evaluate your skills: three equipment questions. */
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { usePro, useUpdatePro } from '@mowly/api';
import type { Pro } from '@mowly/types';
import { Button, Toggle } from '@mowly/ui';

const QUESTIONS = [
  { key: 'mower', label: 'Do you own a commercial mower?' },
  { key: 'trimmer', label: 'Do you own a string trimmer?' },
  { key: 'blower', label: 'Do you own a leaf blower?' },
] as const;

export default function EvaluateScreen() {
  const { data: pro } = usePro();
  return pro ? <EvaluateBody pro={pro} /> : <View testID="screen-evaluate" className="flex-1 bg-surface" />;
}

function EvaluateBody({ pro }: { pro: Pro }) {
  const { mutateAsync: updatePro, isPending } = useUpdatePro();
  const [equipment, setEquipment] = useState(pro.equipment);
  return (
    <View testID="screen-evaluate" className="flex-1 bg-surface">
      <ScrollView contentContainerClassName="gap-4 p-5">
        <Text className="text-base text-inkProBody">Tell us what equipment you bring to a job.</Text>
        {QUESTIONS.map(({ key, label }) => (
          <Toggle
            key={key}
            testID={`equipment-${key}`}
            label={label}
            value={equipment[key]}
            onValueChange={(v) => setEquipment((e) => ({ ...e, [key]: v }))}
          />
        ))}
      </ScrollView>
      <View className="px-5 pb-8">
        <Button
          testID="evaluate-save"
          label="Save"
          loading={isPending}
          onPress={async () => {
            await updatePro({ equipment, equipmentAnswered: true });
            router.back();
          }}
        />
      </View>
    </View>
  );
}
