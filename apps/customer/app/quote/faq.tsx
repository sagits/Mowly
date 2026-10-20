/** Policy FAQ modal (C16, C17): seven expandable questions, OK goes back. */
import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Accordion, Button } from '@mowly/ui';
import { POLICY_FAQ } from '../../src/content/policyFaq';

/** The FAQ screen. */
export default function PolicyFaqScreen() {
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  return (
    <View className="flex-1 bg-surface">
      <ScrollView contentContainerClassName="px-4 pb-6 pt-8">
        <Text className="mb-6 text-3xl text-ink">Frequent Questions about our Policies</Text>
        {POLICY_FAQ.map((f, i) => (
          <Accordion key={f.question} testID={`faq-item-${i}`} title={f.question}>
            {f.answer}
          </Accordion>
        ))}
      </ScrollView>
      <View className="px-4 pt-3" style={{ paddingBottom: bottom + 12 }}>
        <Button testID="faq-ok" label="OK" onPress={() => router.back()} />
      </View>
    </View>
  );
}
