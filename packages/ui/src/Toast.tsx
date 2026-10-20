/** A brief message at the bottom of the screen, driven by a tiny store. */
import { Text, View } from 'react-native';
import { create } from 'zustand';

const TOAST_MS = 2500;

const useToastStore = create<{ message: string | null }>(() => ({ message: null }));
let timer: ReturnType<typeof setTimeout> | undefined;

/** Shows `message` for 2.5 seconds; a newer toast replaces the current one. */
export function showToast(message: string): void {
  clearTimeout(timer);
  useToastStore.setState({ message });
  timer = setTimeout(() => useToastStore.setState({ message: null }), TOAST_MS);
}

/** Mount once near the root; renders the current toast, if any. */
export function ToastHost() {
  const message = useToastStore((s) => s.message);
  if (!message) return null;
  return (
    <View pointerEvents="none" className="absolute inset-x-0 bottom-24 items-center px-6">
      <View testID="toast" className="rounded-card bg-ink px-4 py-3">
        <Text className="text-sm font-semibold text-surface">{message}</Text>
      </View>
    </View>
  );
}
