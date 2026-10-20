// One row of the Inbox list (C21).
import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import type { Thread } from '@mowly/types';
import { dateOf, formatShort } from '@mowly/types';
import { colors } from '@mowly/ui';

/** Initials avatar, pro name, service, one-line last message, date and chevron. Testid `thread-<id>`. */
export function ThreadRow({ thread, onPress }: { thread: Thread; onPress: () => void }) {
  const last = thread.messages[thread.messages.length - 1];
  return (
    <Pressable
      testID={`thread-${thread.id}`}
      onPress={onPress}
      accessibilityRole="button"
      className="mx-4 flex-row items-center border-b border-border py-4"
    >
      <View className="mr-3 h-12 w-12 items-center justify-center rounded-lg bg-primaryTint">
        <Text className="text-lg font-semibold text-primary">{thread.initials}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-lg font-semibold text-inkPro" numberOfLines={1}>{thread.proName}</Text>
        <Text className="text-base text-ink">{thread.serviceName}</Text>
        <View className="mt-1 flex-row items-center justify-between">
          <Text className="mr-2 flex-1 text-sm text-muted" numberOfLines={1}>{last?.text}</Text>
          {last && <Text className="text-sm text-muted">{formatShort(dateOf(last.sentAt))}</Text>}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.primary} style={{ marginLeft: 8, alignSelf: 'flex-start' }} />
    </Pressable>
  );
}
