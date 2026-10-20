/** The Settings list (P15). */
import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { usePro } from '@mowly/api';
import { Button, ListRow } from '@mowly/ui';
import { businessProfileComplete } from '../../../src/checklist';

const ROWS = [
  ['business-profile', 'Business Profile'],
  ['account-info', 'Account Info'],
  ['damage-fee', 'Damage Fee'],
  ['tax-info', 'Tax Info'],
  ['bank', 'Bank Info'],
  ['billing', 'Billing'],
  ['work-area', 'Starting Point'],
  ['location', 'Location Services'],
  ['notifications', 'Notifications'],
  ['account', 'Account Management'],
] as const;

/** The Settings screen: one row per sub-page, the business profile row badged while incomplete. */
export default function SettingsScreen() {
  const { data: pro } = usePro();
  return (
    <View testID="screen-settings" className="flex-1 bg-surface">
      <ScrollView>
        {ROWS.map(([slug, title]) => (
          <ListRow
            key={slug}
            testID={`settings-${slug}`}
            title={title}
            badge={slug === 'business-profile' && pro && !businessProfileComplete(pro) ? '1' : undefined}
            onPress={() => router.push(`/settings/${slug}` as never)}
          />
        ))}
        <Text className="mt-6 text-center text-micro text-muted">Mowly Pro - v1.0.0</Text>
        {/* Wired in Task 11. */}
        <View className="p-5">
          <Button testID="settings-sign-out" label="SIGN OUT" onPress={() => {}} />
        </View>
      </ScrollView>
    </View>
  );
}
