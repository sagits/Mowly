/** A city map photo with absolutely positioned children (pins). */
import type { ReactNode } from 'react';
import { Image, Text, View } from 'react-native';

// ponytail: a static photo, not a live map; pins sit at mock fractions, not real coordinates.
// Public-domain USGS imagery of Austin (The National Map, USGSImageryTopo tiles, zoom 12).
const MAP = require('../assets/city-map.jpg');

/** Aerial map photo cropped to fill `height`, `children` laid over it. */
export function CityMap({ children, height }: { children?: ReactNode; height: number }) {
  return (
    <View testID="city-map" style={{ height }} className="overflow-hidden bg-pageMuted">
      <Image source={MAP} resizeMode="cover" style={{ position: 'absolute', width: '100%', height: '100%' }} />
      <Text className="absolute bottom-1 right-2 text-xs text-surface">USGS</Text>
      {children}
    </View>
  );
}
