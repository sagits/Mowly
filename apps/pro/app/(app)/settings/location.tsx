/** Turn on your GPS (P22). ENABLE GPS only flips a flag: no OS permission prompt. */
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, Text, View } from 'react-native';
import { usePro, useUpdatePro } from '@mowly/api';
import { leaveStep } from '../../../src/drawer/BackButton';
import { Accordion, Button, colors } from '@mowly/ui';

const FAQ = [
  ['Why do I need GPS?', "GPS or Location Services is a feature within the pro app that uses your phone's GPS to check your location when you take a job in the app."],
  ['How often do I need to keep it on?', 'We highly recommend selecting the "Allow all the time" option.'],
  ['What will GPS be required for?', 'While the Location Services feature is not mandatory to use the app, it is required to unlock extra benefits such as claiming Trip Fees.'],
] as const;

export default function LocationScreen() {
  const { data: pro } = usePro();
  const { mutateAsync: updatePro, isPending } = useUpdatePro();
  return (
    <View testID="screen-location" className="flex-1 bg-surface">
      <ScrollView contentContainerClassName="px-5 pb-6">
        <Text className="mt-6 text-center text-2xl font-bold text-inkPro">Turn on your GPS</Text>
        <View className="my-8 items-center">
          <Ionicons name="location" size={72} color={colors.primary} />
        </View>
        <Text className="text-center text-xl font-bold text-inkPro">Enable your GPS</Text>
        <Text className="mt-4 text-center text-lg text-inkProBody">
          Keeping your GPS tracking <Text className="font-bold">"ON"</Text> while using Mowly will help us optimize your experience.
        </Text>
        <Text className="mb-2 mt-8 text-xl font-bold text-primary">Frequently Asked Questions</Text>
        {FAQ.map(([q, a], i) => (
          <Accordion key={q} testID={`gps-faq-${i}`} title={q}>
            {a}
          </Accordion>
        ))}
      </ScrollView>
      <View className="px-5 pb-8">
        {pro?.gpsEnabled ? (
          <Text testID="gps-on" className="text-center text-lg font-bold text-primary">GPS is on</Text>
        ) : (
          <Button
            testID="gps-enable"
            label="ENABLE GPS"
            loading={isPending}
            onPress={async () => {
              await updatePro({ gpsEnabled: true });
              leaveStep();
            }}
          />
        )}
      </View>
    </View>
  );
}
