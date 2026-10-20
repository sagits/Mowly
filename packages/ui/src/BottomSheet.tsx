/** A panel that slides up from the bottom over a dimmed screen. */
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, Text, View } from 'react-native';

/**
 * Slides up in a `Modal`; tapping the scrim or the system back gesture calls `onClose`.
 * `avoidKeyboard` lifts the panel above the iOS keyboard, for sheets with a text field.
 */
export function BottomSheet({
  visible,
  onClose,
  testID,
  title,
  children,
  avoidKeyboard = false,
}: {
  visible: boolean;
  onClose: () => void;
  testID?: string;
  title?: string;
  children?: ReactNode;
  avoidKeyboard?: boolean;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent onRequestClose={onClose}>
      <KeyboardAvoidingView
        className="flex-1 justify-end"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled={avoidKeyboard}
      >
        <Pressable
          testID={testID ? `${testID}-scrim` : undefined}
          accessibilityLabel="Close"
          className="absolute inset-0 bg-scrim"
          onPress={onClose}
        />
        <View testID={testID} className="rounded-t-2xl bg-surface px-5 pb-8 pt-4">
          {title ? <Text className="mb-2 text-lg font-semibold text-ink">{title}</Text> : null}
          {children}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
