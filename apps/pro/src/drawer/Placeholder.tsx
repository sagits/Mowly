/** Stand-in body for a drawer destination until the pro track builds it. */
import { Text, View } from 'react-native';

/** Renders the screen title under the screen testID `screen-<segment>`. */
export function Placeholder({ segment, title }: { segment: string; title: string }) {
  return (
    <View testID={`screen-${segment}`} className="flex-1 bg-surface p-4">
      <Text className="text-xl font-bold text-ink">{title}</Text>
    </View>
  );
}
