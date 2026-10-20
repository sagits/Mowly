// Chat with a pro (invented screen): message bubbles and a composer.
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { useSendMessage, useThread } from '@mowly/api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, Screen, showToast } from '@mowly/ui';

/** Customer bubbles on the right in `primary`, pro bubbles on the left in `callout`. */
export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: thread } = useThread(id);
  const send = useSendMessage();
  const listRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const blank = text.trim() === '';

  const submit = () => {
    if (blank) return;
    const sent = text;
    send.mutate(
      { threadId: id, text: sent.trim() },
      {
        onError: () => {
          setText(sent);
          showToast("Couldn't send your message. Please try again.");
        },
      },
    );
    setText('');
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        testID="chat-screen"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        className="flex-1 bg-surface"
      >
        <Stack.Screen options={{ title: thread?.proName ?? '', headerBackButtonDisplayMode: 'minimal' }} />
        <FlatList
          ref={listRef}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          data={thread?.messages ?? []}
          keyExtractor={(m) => m.id}
          contentContainerStyle={{ padding: 16, gap: 8 }}
          renderItem={({ item: m }) => {
            const mine = m.from === 'customer';
            return (
              <View
                testID={`chat-message-${m.id}`}
                className={`max-w-[75%] rounded-2xl px-3 py-2 ${mine ? 'self-end rounded-br-sm bg-primary' : 'self-start rounded-bl-sm bg-callout'}`}
              >
                <Text className={`text-base ${mine ? 'text-surface' : 'text-ink'}`}>{m.text}</Text>
              </View>
            );
          }}
        />
        <View
          className="flex-row items-center gap-2 border-t border-border px-4 pt-3"
          style={{ paddingBottom: Math.max(insets.bottom, 12) }}
        >
          <TextInput
            testID="chat-input"
            value={text}
            onChangeText={setText}
            onSubmitEditing={submit}
            placeholder="Write a message"
            accessibilityLabel="Message"
            className="flex-1 rounded-full border border-border px-4 py-2 text-base text-ink"
          />
          <Pressable
            testID="chat-send"
            onPress={submit}
            disabled={blank}
            accessibilityRole="button"
            accessibilityLabel="Send"
            className={`h-10 w-10 items-center justify-center rounded-full bg-primary ${blank ? 'opacity-40' : ''}`}
          >
            <Ionicons name="send" size={18} color={colors.surface} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
