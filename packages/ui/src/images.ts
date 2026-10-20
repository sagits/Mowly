/** The bundled photos: one per service, the aerial view and the pro avatars. */
import type { ImageSourcePropType } from 'react-native';
import type { ServiceId } from '@mowly/types';

const SERVICE_IMAGES: Record<ServiceId, ImageSourcePropType> = {
  mowing: require('../assets/services/mowing.jpg'),
  'leaf-removal': require('../assets/services/leaf-removal.jpg'),
  'flower-bed-weeding': require('../assets/services/flower-bed-weeding.jpg'),
  'bush-trimming': require('../assets/services/bush-trimming.jpg'),
  'pool-cleaning': require('../assets/services/pool-cleaning.jpg'),
  'lawn-treatment': require('../assets/services/lawn-treatment.jpg'),
  'mosquito-prevention': require('../assets/services/mosquito-prevention.jpg'),
  aeration: require('../assets/services/aeration.jpg'),
  'aeration-overseeding': require('../assets/services/aeration-overseeding.jpg'),
  cleanup: require('../assets/services/cleanup.jpg'),
  weeding: require('../assets/services/weeding.jpg'),
};

/** The photo for a service. */
export function serviceImage(id: ServiceId): ImageSourcePropType {
  return SERVICE_IMAGES[id];
}

/** A neighborhood seen from above. */
export const AERIAL_IMAGE: ImageSourcePropType = require('../assets/aerial.jpg');

/** Headshots, indexed by `Pro.avatar`. */
export const AVATARS: ImageSourcePropType[] = [
  require('../assets/avatars/1.jpg'),
  require('../assets/avatars/2.jpg'),
  require('../assets/avatars/3.jpg'),
  require('../assets/avatars/4.jpg'),
];
