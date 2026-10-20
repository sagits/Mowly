/** Crews: the pro's crew members. */
import { ScrollView, View } from 'react-native';
import { useCrew } from '@mowly/api';
import { ListRow } from '@mowly/ui';

/** The Crews screen. */
export default function CrewsScreen() {
  const { data = [] } = useCrew();
  return (
    <View testID="screen-crews" className="flex-1 bg-surface">
      <ScrollView>
        {data.map((c) => (
          <ListRow key={c.id} testID={`crew-${c.id}`} title={c.name} subtitle={c.role} chevron={false} />
        ))}
      </ScrollView>
    </View>
  );
}
