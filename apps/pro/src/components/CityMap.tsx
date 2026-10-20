/** An illustrated city map with absolutely positioned children (pins). */
import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { colors } from '@mowly/ui';

// ponytail: drawn with react-native-svg instead of the PRD's bundled map image; a few blocks, streets, a park and a river.
// Swap in the image when real artwork exists. The viewBox stretches to any height (preserveAspectRatio none).
const BLOCKS = [
  [4, 6, 20, 16], [30, 6, 22, 16], [58, 6, 18, 16], [82, 6, 14, 16],
  [4, 34, 20, 18], [30, 34, 22, 18], [58, 34, 18, 18], [82, 34, 14, 18],
  [4, 66, 20, 26], [30, 66, 22, 26], [58, 66, 18, 26], [82, 66, 14, 26],
] as const;

/** Pale map background, `children` laid over it. */
export function CityMap({ children, height }: { children?: ReactNode; height: number }) {
  return (
    <View testID="city-map" style={{ height }} className="overflow-hidden bg-pageMuted">
      <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <Rect x={0} y={0} width={100} height={100} fill={colors.pageMuted} />
        {BLOCKS.map(([x, y, w, h]) => (
          <Rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} rx={1} fill={colors.surface} />
        ))}
        <Rect x={32} y={36} width={18} height={14} rx={2} fill={colors.primaryTint} />
        <Path d="M0 28 C 25 22, 40 32, 60 26 S 90 24, 100 30" stroke={colors.link} strokeOpacity={0.45} strokeWidth={3.5} fill="none" />
        <Path d="M27 0 V100 M55 0 V100 M79 0 V100 M0 58 H100" stroke={colors.callout} strokeWidth={1.2} fill="none" />
      </Svg>
      <Text className="absolute bottom-1 left-2 text-xs text-muted">Austin</Text>
      {children}
    </View>
  );
}
