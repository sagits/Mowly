/** Quote funnel step 1: pick a service (C01-C03). */
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useServices } from '@mowly/api';
import { Button, colors, Screen, Spinner } from '@mowly/ui';
import { FunnelHeader } from '../../src/components/FunnelHeader';
import { afterService, useQuoteDraft } from '../../src/stores/useQuoteDraft';

/** The Service select screen. */
export default function ServiceSelectScreen() {
  const router = useRouter();
  const { data: services } = useServices();
  const serviceId = useQuoteDraft((s) => s.serviceId);
  const selectService = useQuoteDraft((s) => s.selectService);

  return (
    <Screen>
      <FunnelHeader />
      <ScrollView className="flex-1" contentContainerClassName="px-4 pb-6">
        <Text className="mt-6 text-3xl font-bold text-ink">Get started with Mowly!</Text>
        <Text className="mb-5 mt-4 text-lg text-muted">What are you looking for?</Text>
        {services ? (
          services.map((s) => {
            const selected = s.id === serviceId;
            return (
              <Pressable
                key={s.id}
                testID={`service-tile-${s.id}`}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => selectService(s.id)}
                className={`mb-2 items-center justify-center rounded-card py-5 ${
                  selected ? 'border border-primary bg-primaryTint' : 'bg-surfaceMuted'
                }`}
              >
                <Text className="text-lg text-ink">{s.name}</Text>
                {selected ? (
                  <View className="absolute right-4">
                    <Ionicons name="checkmark-circle-outline" size={30} color={colors.primary} />
                  </View>
                ) : null}
              </Pressable>
            );
          })
        ) : (
          <Spinner testID="services-spinner" />
        )}
      </ScrollView>
      <View className="px-4 pb-6 pt-3">
        <Button
          testID="quote-continue"
          label="Continue"
          disabled={!serviceId}
          onPress={() => router.push(afterService(useQuoteDraft.getState()))}
        />
      </View>
    </Screen>
  );
}
