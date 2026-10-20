/** A panel that slides up from the bottom over a dimmed screen. */
import type { ReactNode } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

/** Slides up in a `Modal`; tapping the scrim or the system back gesture calls `onClose`. */
export function BottomSheet({
  visible,
  onClose,
  testID,
  title,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  testID?: string;
  title?: string;
  children?: ReactNode;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent onRequestClose={onClose}>
      <View className="flex-1 justify-end">
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
      </View>
    </Modal>
  );
}
