/** The "Mowly" brand text, with an optional subtitle line. */
import { Text, View } from 'react-native';

/** Green wordmark; the pro app passes `subtitle="for lawn care professionals"`. */
export function Wordmark({ subtitle }: { subtitle?: string }) {
  return (
    <View className="items-center">
      <Text className="text-4xl font-bold text-primary">Mowly</Text>
      {subtitle ? <Text className="mt-1 text-sm text-muted">{subtitle}</Text> : null}
    </View>
  );
}
