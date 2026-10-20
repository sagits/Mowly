/** The loading indicator. */
import { ActivityIndicator } from 'react-native';
import { colors } from '../tokens';

/** A gray `ActivityIndicator`. */
export function Spinner({ testID, size = 'small' }: { testID?: string; size?: 'small' | 'large' }) {
  return <ActivityIndicator testID={testID} size={size} color={colors.priceBlock} />;
}
