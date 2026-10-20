/** Placeholder Profile tab until the customer track builds it. */
import { View } from 'react-native';
import { HeaderBand, Screen } from '@mowly/ui';

/** The Profile tab. */
export default function ProfileScreen() {
  return (
    <View testID="screen-profile" className="flex-1">
      <Screen>
        <HeaderBand title="Profile" />
      </Screen>
    </View>
  );
}
