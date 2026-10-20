/** Placeholder My Services tab until the customer track builds it. */
import { View } from 'react-native';
import { HeaderBand, Screen } from '@mowly/ui';

/** The My Services tab. */
export default function MyServicesScreen() {
  return (
    <View testID="screen-services" className="flex-1">
      <Screen>
        <HeaderBand title="My Services" />
      </Screen>
    </View>
  );
}
