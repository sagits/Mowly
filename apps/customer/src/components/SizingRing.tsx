/** The circular aerial photo with a green ring that draws itself around it over `durationMs`. */
import { useEffect } from 'react';
import { Image, View } from 'react-native';
import Animated, { Easing, useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { AERIAL_IMAGE, colors } from '@mowly/ui';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const SIZE = 250;
const STROKE = 10;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** Aerial photo in a circle, ring progress from empty to full. */
export function SizingRing({ durationMs }: { durationMs: number }) {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withTiming(1, { duration: durationMs, easing: Easing.linear });
  }, [durationMs, progress]);
  const animatedProps = useAnimatedProps(() => ({ strokeDashoffset: CIRCUMFERENCE * (1 - progress.value) }));

  return (
    <View testID="sizing-ring" style={{ width: SIZE, height: SIZE }}>
      <Image
        source={AERIAL_IMAGE}
        style={{ position: 'absolute', top: STROKE, left: STROKE, width: SIZE - STROKE * 2, height: SIZE - STROKE * 2, borderRadius: SIZE }}
      />
      <Svg width={SIZE} height={SIZE} style={{ position: 'absolute' }}>
        <AnimatedCircle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={colors.primary}
          strokeWidth={STROKE}
          fill="none"
          strokeDasharray={CIRCUMFERENCE}
          animatedProps={animatedProps}
          strokeLinecap="butt"
          rotation={-90}
          origin={`${SIZE / 2}, ${SIZE / 2}`}
        />
      </Svg>
    </View>
  );
}
