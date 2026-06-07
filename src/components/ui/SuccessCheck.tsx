import React, { memo, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { palette } from '@/theme';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface SuccessCheckProps {
  size?: number;
  color?: string;
}

/** Animated success checkmark (circle + tick draw-on). */
function SuccessCheckComponent({
  size = 96,
  color = palette.success,
}: SuccessCheckProps) {
  const reduced = useReducedMotion();
  const progress = useSharedValue(reduced ? 1 : 0);
  const circleLen = 2 * Math.PI * (size / 2 - 4);
  const checkLen = size * 0.6;

  useEffect(() => {
    if (reduced) {
      progress.value = 1;
      return;
    }
    progress.value = withTiming(1, {
      duration: 700,
      easing: Easing.out(Easing.cubic),
    });
  }, [reduced, progress]);

  const circleProps = useAnimatedProps(() => ({
    strokeDashoffset: circleLen * (1 - progress.value),
  }));
  const checkProps = useAnimatedProps(() => ({
    strokeDashoffset: checkLen * (1 - Math.max(0, progress.value - 0.4) / 0.6),
  }));

  const r = size / 2 - 4;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <AnimatedCircle
          cx={cx}
          cy={cy}
          r={r}
          stroke={color}
          strokeWidth={5}
          fill="none"
          strokeDasharray={circleLen}
          animatedProps={circleProps}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
        />
        <AnimatedPath
          d={`M ${size * 0.3} ${size * 0.52} L ${size * 0.45} ${size * 0.66} L ${size * 0.72} ${size * 0.36}`}
          stroke={color}
          strokeWidth={6}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={checkLen}
          animatedProps={checkProps}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
});

export const SuccessCheck = memo(SuccessCheckComponent);
