/** Placeholder Inbox tab until the customer track builds it. */
import { View } from 'react-native';
import { HeaderBand, Screen } from '@mowly/ui';

/** The Inbox tab. */
export default function InboxScreen() {
  return (
    <View testID="screen-inbox" className="flex-1">
      <Screen>
        <HeaderBand title="Inbox" />
      </Screen>
    </View>
  );
}
