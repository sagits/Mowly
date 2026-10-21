/** The Inbox tab: the customer's conversations with pros (C21). */
import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { useThreads } from '@mowly/api';
import { Screen, Skeleton } from '@mowly/ui';
import { CustomerHeader } from '../../src/components/CustomerHeader';
import { ThreadRow } from '../../src/components/ThreadRow';

/** The Inbox tab. */
export default function InboxScreen() {
  const router = useRouter();
  const { data: threads, isPending } = useThreads();
  return (
    <View testID="screen-inbox" className="flex-1">
      <Screen>
        <CustomerHeader title="Inbox" />
        {isPending ? (
          <View testID="inbox-loading" className="px-4 pt-4">
            <Skeleton className="mb-4 h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </View>
        ) : !threads?.length ? (
          <View testID="inbox-empty" className="flex-1 items-center justify-center px-8">
            <Text className="text-lg text-muted">No messages yet</Text>
          </View>
        ) : (
          <ScrollView className="flex-1">
            {threads.map((t) => (
              <ThreadRow key={t.id} thread={t} onPress={() => router.push({ pathname: '/chat/[id]', params: { id: t.id } })} />
            ))}
          </ScrollView>
        )}
      </Screen>
    </View>
  );
}
