/** Inbox: customer threads, newest message as the preview. */
import { ScrollView, View } from 'react-native';
import { useProThreads } from '@mowly/api';
import { ListRow } from '@mowly/ui';
import { ScreenLoading } from '../../../src/components/ScreenLoading';

/** The Inbox screen. */
export default function InboxScreen() {
  const { data = [], isPending } = useProThreads();
  return (
    <View testID="screen-inbox" className="flex-1 bg-surface">
      <ScrollView>
        {isPending && <ScreenLoading rows={3} />}
        {data.map((t) => (
          <ListRow key={t.id} testID={`pro-thread-${t.id}`} title={t.proName} subtitle={t.messages.at(-1)?.text} chevron={false} />
        ))}
      </ScrollView>
    </View>
  );
}
