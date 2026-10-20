/** Placeholder welcome screen, shown after sign out, until the pro track builds it. */
import { View } from 'react-native';
import { Wordmark } from '@mowly/ui';

/** The signed-out welcome screen. */
export default function WelcomeScreen() {
  return (
    <View testID="screen-welcome" className="flex-1 items-center justify-center bg-surface">
      <Wordmark subtitle="for lawn care professionals" />
    </View>
  );
}
