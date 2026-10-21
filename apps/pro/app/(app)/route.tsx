/** Route Map (P13): today's stops as numbered pins joined by a polyline, and a row per stop. */
import { ScrollView, Text, View } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import { useTodayRoute } from '@mowly/api';
import { formatLong, FREQUENCY_LABELS, today } from '@mowly/types';
import { colors, Skeleton } from '@mowly/ui';
import { CityMap } from '../../src/components/CityMap';
import { MapPin } from '../../src/components/MapPin';

export default function RouteScreen() {
  const { data: stops } = useTodayRoute();
  return (
    <View testID="screen-route" className="flex-1 bg-surface">
      <ScrollView>
        <CityMap height={300} aerial>
          {stops && stops.length > 1 && (
            <Svg pointerEvents="none" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute' }}>
              <Polyline points={stops.map((s) => `${s.pin.x * 100},${s.pin.y * 100}`).join(' ')} stroke={colors.routeBlue} strokeWidth={1.2} fill="none" strokeLinejoin="round" />
            </Svg>
          )}
          {stops?.map((s, i) => (
            <MapPin key={s.id} testID={`route-pin-${i + 1}`} x={s.pin.x} y={s.pin.y} label={String(i + 1)} variant="number" selected />
          ))}
        </CityMap>
        <Text className="bg-primaryTint px-4 py-3 text-base text-inkPro">{`Starting Date: ${formatLong(today())}`}</Text>
        {!stops ? (
          <View testID="route-loading" className="gap-3 p-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </View>
        ) : stops.length === 0 ? (
          <Text testID="route-empty" className="p-8 text-center text-lg text-inkProBody">No jobs on your route today.</Text>
        ) : (
          stops.map((s, i) => (
            <View key={s.id} testID={`route-stop-${i + 1}`} className="flex-row items-center gap-3 border-b border-border px-4 py-4">
              <View className="h-8 w-8 items-center justify-center rounded-full bg-primary">
                <Text className="font-semibold text-surface">{i + 1}</Text>
              </View>
              <View className="flex-1 gap-0.5">
                <Text className="text-lg font-bold text-ink">{s.address.line1}</Text>
                <Text className="text-lg font-bold text-ink">{`${s.address.city}, ${s.address.state} ${s.address.zip}`}</Text>
                <Text className="text-base text-inkProBody">{`${s.serviceName}, ${FREQUENCY_LABELS[s.frequency]}`}</Text>
                <Text className="text-base text-inkProBody">{`${s.distanceMiles} mi from ${i === 0 ? 'starting point' : 'previous job'}`}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
