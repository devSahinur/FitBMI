import React, { memo, useEffect, useState } from 'react';
import { type TextStyle } from 'react-native';
import {
  useSharedValue,
  withTiming,
  useAnimatedReaction,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { Text } from './Text';

interface AnimatedCounterProps {
  value: number;
  decimals?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  style?: TextStyle;
  variant?: React.ComponentProps<typeof Text>['variant'];
  tone?: React.ComponentProps<typeof Text>['tone'];
}

/**
 * Animates a number from its previous value to the new one.
 * Drives a JS state update from a Reanimated worklet for broad compatibility.
 */
function AnimatedCounterComponent({
  value,
  decimals = 0,
  duration = 900,
  prefix = '',
  suffix = '',
  style,
  variant = 'h1',
  tone = 'default',
}: AnimatedCounterProps) {
  const progress = useSharedValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(value, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  }, [value, duration, progress]);

  useAnimatedReaction(
    () => progress.value,
    (current) => {
      runOnJS(setDisplay)(current);
    },
  );

  const formatted = display.toFixed(decimals);

  return (
    <Text
      variant={variant}
      tone={tone}
      style={style}
      accessibilityLabel={`${prefix}${value.toFixed(decimals)}${suffix}`}
    >
      {prefix}
      {formatted}
      {suffix}
    </Text>
  );
}

export const AnimatedCounter = memo(AnimatedCounterComponent);
