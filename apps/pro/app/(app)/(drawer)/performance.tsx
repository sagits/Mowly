/** Performance: the pro's headline stats. */
import { ScrollView, Text, View } from 'react-native';
import { usePerformance } from '@mowly/api';
import { Card } from '@mowly/ui';

/** The Performance screen. */
export default function PerformanceScreen() {
  const { data = [] } = usePerformance();
  return (
    <View testID="screen-performance" className="flex-1 bg-surfaceMuted">
      <ScrollView contentContainerClassName="gap-4 p-4">
        {data.map((s, i) => (
          <Card key={s.label} testID={`stat-${i}`} className="p-4">
            <Text className="text-3xl font-bold text-inkPro">{s.value}</Text>
            <Text className="text-base text-inkProBody">{s.label}</Text>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}
