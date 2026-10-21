/** Support (P14): three cards, buttons are demo-only. */
import type { ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Button, Card, showToast } from '@mowly/ui';

const demo = () => showToast('Not in this demo');

function SupportCard({ title, children, action }: { title: string; children: ReactNode; action?: { id: string; label: string } }) {
  return (
    <Card className="overflow-hidden">
      <Text className="p-4 text-lg font-semibold text-inkPro">{title}</Text>
      <View className="border-t border-border p-4">{children}</View>
      {action && (
        <View className="border-t border-border">
          <Button testID={action.id} label={action.label} variant="text" onPress={demo} />
        </View>
      )}
    </Card>
  );
}

/** The Support screen. */
export default function SupportScreen() {
  return (
    <View testID="screen-support" className="flex-1 bg-surfaceMuted">
      <ScrollView contentContainerClassName="gap-4 p-4">
        <SupportCard title="Need help with something?" action={{ id: 'support-message', label: 'Send Message to Mowly' }}>
          <Text className="text-lg text-inkProBody">
            We want to make sure everything works the way you need it to. If something is not right, let us know.
          </Text>
        </SupportCard>
        <SupportCard title="Need to talk to somebody?">
          <Text className="text-lg text-inkProBody">
            Mowly Pro Support is available Mondays through Sundays,{' '}
            <Text className="text-primary" onPress={demo}>
              tap here to see how to reach us.
            </Text>
          </Text>
        </SupportCard>
        <SupportCard title="Have a question about the Mowly platform?" action={{ id: 'support-kb', label: 'Visit the Knowledge Base' }}>
          <Text className="text-lg text-inkProBody">Head over to our knowledge base for answers to frequently asked questions.</Text>
        </SupportCard>
      </ScrollView>
    </View>
  );
}
