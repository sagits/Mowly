/** Recommend a service to the neighbor (P12): pick a service, then quote a price and a note. */
import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSendRecommendation } from '@mowly/api';
import { RecommendSchema } from '@mowly/types';
import { Button, FormField, showToast } from '@mowly/ui';

const SERVICES = [
  { id: 'bush-trimming', label: 'Bush Trimming' },
  { id: 'cleanup', label: 'Cleanup' },
  { id: 'tree-trimming', label: 'Tree Trimming' },
  { id: 'bed-weeding', label: 'Bed Weeding' },
  { id: 'mulching', label: 'Mulching' },
  { id: 'other', label: 'Other' },
];

type Values = { price: string; note: string };

/** The recommend screen. */
export default function RecommendScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [service, setService] = useState<string | null>(null);
  const sending = useRef(false);
  const { mutateAsync: send, isPending } = useSendRecommendation();
  const { control, handleSubmit } = useForm<Values>({
    resolver: zodResolver(RecommendSchema) as never,
    defaultValues: { price: '', note: '' },
  });

  const onValid = async (values: Values) => {
    if (!service || sending.current) return;
    sending.current = true;
    try {
      await send({ jobId: id, service, price: Number(values.price), note: values.note });
      showToast('Recommendation sent');
      router.back();
    } finally {
      sending.current = false;
    }
  };

  return (
    <View testID="screen-recommend" className="flex-1 bg-surface">
      <ScrollView contentContainerClassName="gap-4 p-5" keyboardShouldPersistTaps="handled">
        <Text className="text-center text-2xl text-primary">Which service would you like to recommend?</Text>
        <View className="flex-row flex-wrap gap-3">
          {SERVICES.map((s) => (
            <Pressable
              key={s.id}
              testID={`recommend-${s.id}`}
              accessibilityRole="button"
              accessibilityState={{ selected: service === s.id }}
              onPress={() => setService(s.id)}
              className={`h-24 w-[48%] items-center justify-center border ${service === s.id ? 'border-primary bg-primary/10' : 'border-primary/20'}`}
            >
              <Text className="text-base text-inkPro">{s.label}</Text>
            </Pressable>
          ))}
        </View>
        {service ? (
          <>
            <FormField control={control} name="price" label="Price ($)" testID="recommend-price" keyboardType="numbers-and-punctuation" />
            <FormField control={control} name="note" label="Note" testID="recommend-note" multiline />
            <Button testID="recommend-send" label="Send" variant="orange" loading={isPending} onPress={() => void handleSubmit(onValid)()} />
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}
