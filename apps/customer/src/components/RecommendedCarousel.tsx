// The "Recommended for you" paging carousel on Browse (C18).
import { useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import type { ServiceId } from '@mowly/types';
import { Button, serviceImage } from '@mowly/ui';

const RECOS: { id: ServiceId; title: string; body: string }[] = [
  { id: 'leaf-removal', title: 'Take a break', body: 'Clear your lawn of leaves without the hassle.' },
  { id: 'lawn-treatment', title: 'Keep it green', body: 'Fertilizer and weed control for a thick lawn.' },
  { id: 'mosquito-prevention', title: 'Bite-free summer', body: 'Keep mosquitoes out of your yard.' },
];

/** Three full-width cards that snap one at a time, with page dots. Testids `browse-reco-<id>` and `browse-reco-<id>-quote`. */
export function RecommendedCarousel({ onQuote }: { onQuote: (id: ServiceId) => void }) {
  const [width, setWidth] = useState(0);
  const [page, setPage] = useState(0);
  return (
    <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => setPage(Math.round(e.nativeEvent.contentOffset.x / (width || 1)))}
      >
        {RECOS.map((r) => (
          <View key={r.id} style={{ width }}>
            <View testID={`browse-reco-${r.id}`} className="flex-row items-center rounded-xl border border-border bg-surface p-4">
              <View className="flex-1 pr-3">
                <Text className="text-lg font-semibold text-ink">{r.title}</Text>
                <Text className="mb-4 mt-1 text-sm text-ink">{r.body}</Text>
                <View className="self-start">
                  <Button testID={`browse-reco-${r.id}-quote`} label="Get a quote" size="sm" onPress={() => onQuote(r.id)} />
                </View>
              </View>
              <Image source={serviceImage(r.id)} className="h-28 w-28 rounded-lg" resizeMode="cover" />
            </View>
          </View>
        ))}
      </ScrollView>
      <View className="mt-2 flex-row justify-center gap-2">
        {RECOS.map((r, i) => (
          <View key={r.id} className={`h-2 w-2 rounded-full ${i === page ? 'bg-primary' : 'bg-surfaceMuted'}`} />
        ))}
      </View>
    </View>
  );
}
