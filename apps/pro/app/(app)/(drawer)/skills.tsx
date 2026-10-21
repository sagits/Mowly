/** Add your skills (checklist step) and Skills and Services (drawer item). */
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { usePro, useUpdatePro } from '@mowly/api';
import type { Pro } from '@mowly/types';
import { Button, Toggle } from '@mowly/ui';
import { CATEGORY_LABEL, CORE_SKILLS, kebab } from '../../../src/content/coreSkills';
import { ScreenLoading } from '../../../src/components/ScreenLoading';

export default function SkillsScreen() {
  const { data: pro } = usePro();
  return pro ? <SkillsBody pro={pro} /> : <ScreenLoading />;
}

function SkillsBody({ pro }: { pro: Pro }) {
  const { mutateAsync: updatePro, isPending } = useUpdatePro();
  const [skills, setSkills] = useState(pro.skills);
  const toggle = (s: string, on: boolean) => setSkills((cur) => (on ? [...cur, s] : cur.filter((x) => x !== s)));
  return (
    <View testID="screen-skills" className="flex-1 bg-surface">
      <ScrollView contentContainerClassName="gap-4 p-5">
        <View className="flex-row items-center gap-3 rounded-2xl bg-callout p-4">
          <Ionicons name="bulb-outline" size={22} />
          <Text className="text-lg font-semibold text-inkPro">{CATEGORY_LABEL[pro.category]}</Text>
        </View>
        {CORE_SKILLS[pro.category].map((s) => (
          <Toggle key={s} testID={`skill-${kebab(s)}`} label={s} value={skills.includes(s)} onValueChange={(on) => toggle(s, on)} />
        ))}
      </ScrollView>
      <View className="px-5 pb-8">
        <Button
          testID="skills-save"
          label="Save"
          disabled={skills.length === 0}
          loading={isPending}
          onPress={async () => {
            await updatePro({ skills });
            router.back();
          }}
        />
      </View>
    </View>
  );
}
