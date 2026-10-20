/** Notifications (P23): each toggle saves at once. */
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { usePro, useUpdatePro } from '@mowly/api';
import type { NotificationPrefs, Pro } from '@mowly/types';
import { Toggle } from '@mowly/ui';
import { ScreenLoading } from '../../../src/components/ScreenLoading';

const SECTIONS = [
  { key: 'jobs', title: 'Job Notifications' },
  { key: 'messages', title: 'Customer Messages' },
] as const;
const CHANNELS = [
  { key: 'email', label: 'Email' },
  { key: 'text', label: 'Text Message' },
  { key: 'push', label: 'Push Notification' },
] as const;

/** Renders once the Pro has loaded. */
export default function NotificationsScreen() {
  const { data: pro } = usePro();
  return pro ? <Body pro={pro} /> : <ScreenLoading />;
}

function Body({ pro }: { pro: Pro }) {
  const { mutate } = useUpdatePro();
  // Seeded once and rendered from local state, so a switch flips at once instead of waiting on the save and refetch.
  // Prefs don't change elsewhere while this screen is mounted.
  const [prefs, setPrefs] = useState<NotificationPrefs>(pro.notifications);
  const change = (section: 'jobs' | 'messages', channel: 'email' | 'text' | 'push', value: boolean) => {
    const next = { ...prefs, [section]: { ...prefs[section], [channel]: value } };
    setPrefs(next);
    mutate({ notifications: next });
  };
  return (
    <ScrollView testID="screen-notifications" className="flex-1 bg-surface" contentContainerClassName="px-5 pb-8">
      {SECTIONS.map((s) => (
        <View key={s.key}>
          <Text className="mb-2 mt-8 text-2xl font-bold text-inkPro">{s.title}</Text>
          {CHANNELS.map((c) => (
            <View key={c.key} className="border-b border-border py-3">
              <Toggle testID={`notif-${s.key}-${c.key}`} label={c.label} value={prefs[s.key][c.key]} onValueChange={(v) => change(s.key, c.key, v)} />
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}
