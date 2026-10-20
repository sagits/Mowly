/** A confirm dialog shown over the screen. */
import { ActivityIndicator, Modal, Pressable, Text, View } from 'react-native';
import { colors } from '../tokens';

/** Asks before a destructive action, in a `Modal` so tests can see it. `onKeep` doubles as `onRequestClose`; tapping the scrim does not dismiss. */
export function ConfirmDialog({
  visible,
  testID,
  title,
  message,
  keepTestID,
  keepLabel = 'Keep it',
  onKeep,
  confirmTestID,
  confirmLabel,
  onConfirm,
  pending = false,
  spinnerTestID,
}: {
  visible: boolean;
  testID?: string;
  title: string;
  message: string;
  keepTestID: string;
  keepLabel?: string;
  onKeep: () => void;
  confirmTestID: string;
  confirmLabel: string;
  onConfirm: () => void;
  /** The confirm is a request that can be waited on. Omitted where it is synchronous and cannot be. */
  pending?: boolean;
  spinnerTestID?: string;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onKeep}
    >
      <View className="flex-1 items-center justify-center bg-scrim px-8">
        <View testID={testID} className="w-full rounded-card bg-surface px-5 py-5 shadow-card">
          <Text className="text-lg font-semibold text-ink">{title}</Text>
          <Text className="mt-2 text-sm leading-5 text-muted">{message}</Text>
          <View className="mt-4 flex-row gap-3">
            <Pressable
              testID={keepTestID}
              accessibilityRole="button"
              accessibilityLabel={keepLabel}
              className="flex-1 items-center rounded-card border border-border py-3"
              onPress={onKeep}
            >
              <Text className="text-base font-semibold text-ink">{keepLabel}</Text>
            </Pressable>
            <Pressable
              testID={confirmTestID}
              accessibilityRole="button"
              accessibilityLabel={confirmLabel}
              accessibilityState={{ disabled: pending }}
              disabled={pending}
              className={`flex-1 flex-row items-center justify-center gap-2 rounded-card bg-danger py-3 ${
                pending ? 'opacity-60' : ''
              }`}
              onPress={onConfirm}
            >
              {pending ? <ActivityIndicator testID={spinnerTestID} color={colors.surface} /> : null}
              <Text className="text-base font-semibold text-surface">{confirmLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
