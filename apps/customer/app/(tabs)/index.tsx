/** Placeholder Browse tab until the customer track builds it. */
import { View } from 'react-native';
import { HeaderBand, Screen } from '@mowly/ui';

/** The Browse tab. */
export default function BrowseScreen() {
  return (
    <View testID="screen-browse" className="flex-1">
      <Screen>
        <HeaderBand title="Browse" />
      </Screen>
    </View>
  );
}
