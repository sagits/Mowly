// One "Services to explore" row on Browse (C18).
import { Image, Text, View } from 'react-native';
import type { Service } from '@mowly/types';
import { Button, serviceImage } from '@mowly/ui';

/** Photo left; title, the `included` line and a VIEW PRICE outline pill right. Testid `browse-service-<id>`. */
export function ServiceExploreRow({ service, onViewPrice }: { service: Service; onViewPrice: () => void }) {
  return (
    <View testID={`browse-service-${service.id}`} className="mb-4 flex-row overflow-hidden rounded-xl border border-border bg-surface">
      <Image source={serviceImage(service.id)} className="h-36 w-36" resizeMode="cover" />
      <View className="flex-1 justify-between p-3">
        <View>
          <Text className="text-lg font-semibold text-ink">{service.name}</Text>
          <Text numberOfLines={1} className="mt-1 text-sm text-ink">{service.included}</Text>
        </View>
        <View className="self-end">
          <Button testID={`browse-view-price-${service.id}`} label="View price" variant="outline" size="sm" onPress={onViewPrice} />
        </View>
      </View>
    </View>
  );
}
