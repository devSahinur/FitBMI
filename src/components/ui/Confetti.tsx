import React, { memo, useEffect } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { palette } from '@/theme';

const COLORS = [
  palette.primary,
  palette.secondary,
  palette.overweight,
  palette.obese,
  palette.primaryLight,
];

interface ConfettiProps {
  /** Toggle to fire the burst. */
  active: boolean;
  count?: number;
}

interface PieceProps {
  index: number;
  active: boolean;
  width: number;
  height: number;
}

function Piece({ index, active, width, height }: PieceProps) {
  const progress = useSharedValue(0);
  // Deterministic pseudo-random spread from the index.
  const startX = (Math.sin(index * 12.9898) * 0.5 + 0.5) * width;
  const drift = (Math.cos(index * 78.233) * 0.5) * 120;
  const rotateTo = (index % 2 === 0 ? 1 : -1) * (360 + (index % 4) * 90);
  const color = COLORS[index % COLORS.length];
  const delay = (index % 10) * 40;
  const sizePx = 8 + (index % 3) * 3;

  useEffect(() => {
    if (active) {
      progress.value = 0;
      progress.value = withDelay(
        delay,
        withTiming(1, { duration: 1800, easing: Easing.out(Easing.quad) }),
      );
    }
  }, [active, progress, delay]);

  const style = useAnimatedStyle(() => ({
    opacity: active ? 1 - progress.value : 0,
    transform: [
      { translateX: startX + drift * progress.value },
      { translateY: progress.value * height },
      { rotate: `${rotateTo * progress.value}deg` },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.piece,
        { width: sizePx, height: sizePx * 1.6, backgroundColor: color },
        style,
      ]}
    />
  );
}

/** Lightweight confetti burst (no native deps) for goal celebrations. */
function ConfettiComponent({ active, count = 40 }: ConfettiProps) {
  const { width, height } = useWindowDimensions();
  if (!active) return null;
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {Array.from({ length: count }, (_, i) => (
        <Piece key={i} index={i} active={active} width={width} height={height} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  piece: {
    position: 'absolute',
    top: 0,
    borderRadius: 2,
  },
});

export const Confetti = memo(ConfettiComponent);
