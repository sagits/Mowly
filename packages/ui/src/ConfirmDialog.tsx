/** An iOS-alert style confirm dialog shown over the screen. */
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
  destructive = true,
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
  /** Colors the confirm `danger` (default) or, when false, `primary`. */
  destructive?: boolean;
}) {
  const confirmInk = destructive ? 'text-danger' : 'text-primary';
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onKeep}
    >
      <View className="flex-1 items-center justify-center bg-scrim px-8">
        <View testID={testID} className="w-full rounded-3xl bg-pageMuted px-5 py-6">
          <Text className="px-2 text-xl text-ink">{title}</Text>
          {message ? <Text className="mt-2 px-2 text-sm leading-5 text-muted">{message}</Text> : null}
          <View className="mt-5 flex-row gap-3">
            <Pressable
              testID={keepTestID}
              accessibilityRole="button"
              accessibilityLabel={keepLabel}
              className="flex-1 items-center rounded-full bg-callout py-3.5"
              onPress={onKeep}
            >
              <Text className="text-lg font-semibold text-ink">{keepLabel}</Text>
            </Pressable>
            <Pressable
              testID={confirmTestID}
              accessibilityRole="button"
              accessibilityLabel={confirmLabel}
              accessibilityState={{ disabled: pending }}
              disabled={pending}
              className={`flex-1 flex-row items-center justify-center gap-2 rounded-full bg-callout py-3.5 ${
                pending ? 'opacity-60' : ''
              }`}
              onPress={onConfirm}
            >
              {pending ? (
                <ActivityIndicator testID={spinnerTestID} color={destructive ? colors.danger : colors.primary} />
              ) : null}
              <Text className={`text-lg font-semibold ${confirmInk}`}>{confirmLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
