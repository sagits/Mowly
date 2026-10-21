/** Quote step 3 (C07): animated lawn sizing, then on to the plan after SIZING_MS. */
import { Redirect, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useNeighbors } from '@mowly/api';
import { Screen } from '@mowly/ui';
import { SizingRing } from '../../src/components/SizingRing';
import { missingStep, useQuoteDraft } from '../../src/stores/useQuoteDraft';

/** How long the sizing animation plays before the plan step. */
export const SIZING_MS = 3000;

/** The sizing step. */
export default function QuoteSizingScreen() {
  const router = useRouter();
  const zip = useQuoteDraft((s) => s.contact?.addressText.match(/\d{5}(?!.*\d{5})/)?.[0] ?? '');
  const { data } = useNeighbors(zip);
  const missing = useQuoteDraft((s) => missingStep(s, 'plan'));

  useEffect(() => {
    if (missing) return;
    const t = setTimeout(() => router.replace('/quote/plan'), SIZING_MS);
    return () => clearTimeout(t);
  }, [router, missing]);

  if (missing) return <Redirect href={missing} />;
  return (
    <Screen>
      <View testID="sizing-screen" className="flex-1 items-center justify-center bg-surface px-12">
        <SizingRing durationMs={SIZING_MS} />
        <Text className="mt-12 text-center text-3xl font-bold text-ink">We&apos;re sizing your lawn with satellite precision!</Text>
        {data !== undefined && zip !== '' && (
          <Text className="mt-6 text-center text-xl text-inkSoft">
            <Text testID="sizing-neighbors">
              Join <Text className="text-primary">{data} neighbors</Text> in {zip}
            </Text>{' '}
            who&apos;ve booked Mowly
          </Text>
        )}
      </View>
    </Screen>
  );
}
