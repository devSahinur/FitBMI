import React, { memo, useEffect } from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle, G } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { palette } from '@/theme';
import { BMI_GAUGE_MAX, BMI_THRESHOLDS } from '@/constants';

const AnimatedG = Animated.createAnimatedComponent(G);

interface GaugeProps {
  bmi: number;
  size?: number;
}

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const a = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

/** Arc path between two angles (degrees, measured from +x axis). */
function arc(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number,
): string {
  const start = polar(cx, cy, r, startDeg);
  const end = polar(cx, cy, r, endDeg);
  const largeArc = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  // sweep=1 draws clockwise in SVG's y-down coordinate space.
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

/** Map a BMI value to the gauge angle (180° = left/empty .. 360° = right/full). */
function bmiToAngle(bmi: number): number {
  const clamped = Math.min(Math.max(bmi, 0), BMI_GAUGE_MAX);
  return 180 + (clamped / BMI_GAUGE_MAX) * 180;
}

/**
 * Semicircular BMI gauge with four classification bands and an animated needle.
 */
function GaugeComponent({ bmi, size = 240 }: GaugeProps) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 20;
  const stroke = 18;

  const segments = [
    { from: 0, to: BMI_THRESHOLDS.underweight, color: palette.underweight },
    {
      from: BMI_THRESHOLDS.underweight,
      to: BMI_THRESHOLDS.normal,
      color: palette.normal,
    },
    {
      from: BMI_THRESHOLDS.normal,
      to: BMI_THRESHOLDS.overweight,
      color: palette.overweight,
    },
    { from: BMI_THRESHOLDS.overweight, to: BMI_GAUGE_MAX, color: palette.obese },
  ];

  const needle = useSharedValue(180);
  useEffect(() => {
    needle.value = withTiming(bmiToAngle(bmi), {
      duration: 1100,
      easing: Easing.out(Easing.cubic),
    });
  }, [bmi, needle]);

  const animatedProps = useAnimatedProps(() => ({
    originX: cx,
    originY: cy,
    rotation: needle.value - 270, // align needle pointing up at start
  }));

  return (
    <View style={{ width: size, height: size / 2 + 24 }}>
      <Svg width={size} height={size / 2 + 24}>
        {segments.map((s) => (
          <Path
            key={s.from}
            d={arc(cx, cy, r, bmiToAngle(s.from), bmiToAngle(s.to))}
            stroke={s.color}
            strokeWidth={stroke}
            strokeLinecap="round"
            fill="none"
          />
        ))}
        {/* Needle */}
        <AnimatedG animatedProps={animatedProps}>
          <Path
            d={`M ${cx} ${cy} L ${cx} ${cy - r + 6}`}
            stroke={palette.dark}
            strokeWidth={3}
            strokeLinecap="round"
          />
        </AnimatedG>
        <Circle cx={cx} cy={cy} r={8} fill={palette.dark} />
      </Svg>
    </View>
  );
}

export const Gauge = memo(GaugeComponent);
