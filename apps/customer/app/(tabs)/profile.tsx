/** Placeholder Profile tab until the customer track builds it. */
import { View } from 'react-native';
import { Screen } from '@mowly/ui';
import { CustomerHeader } from '../../src/components/CustomerHeader';

/** The Profile tab. */
export default function ProfileScreen() {
  return (
    <View testID="screen-profile" className="flex-1">
      <Screen>
        <CustomerHeader title="Profile" />
      </Screen>
    </View>
  );
}
