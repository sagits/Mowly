/** Placeholder Inbox tab until the customer track builds it. */
import { View } from 'react-native';
import { Screen } from '@mowly/ui';
import { CustomerHeader } from '../../src/components/CustomerHeader';

/** The Inbox tab. */
export default function InboxScreen() {
  return (
    <View testID="screen-inbox" className="flex-1">
      <Screen>
        <CustomerHeader title="Inbox" />
      </Screen>
    </View>
  );
}
