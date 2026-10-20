/** Notifications (P23): each toggle saves at once. */
import { useRef } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { usePro, useUpdatePro } from '@mowly/api';
import type { NotificationPrefs, Pro } from '@mowly/types';
import { Toggle } from '@mowly/ui';

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
  return pro ? <Body pro={pro} /> : null;
}

function Body({ pro }: { pro: Pro }) {
  const { mutate } = useUpdatePro();
  // Seeded once: prefs don't change elsewhere while this screen is mounted.
  // Merge against the last value we sent, not the query data, which lags until the refetch lands.
  const latest = useRef<NotificationPrefs>(pro.notifications);
  const prefs = pro.notifications;
  const change = (section: 'jobs' | 'messages', channel: 'email' | 'text' | 'push', value: boolean) => {
    latest.current = { ...latest.current, [section]: { ...latest.current[section], [channel]: value } };
    mutate({ notifications: latest.current });
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
