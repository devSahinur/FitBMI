import React, { memo, useEffect } from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { radius, shadows } from '@/theme';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface AnimatedGradientCardProps {
  children: React.ReactNode;
  colors?: readonly [string, string, ...string[]];
  style?: ViewStyle;
  padded?: boolean;
}

/**
 * Floating card with a slowly rotating gradient sheen behind the content.
 * Falls back to a static gradient when reduced motion is enabled.
 */
function AnimatedGradientCardComponent({
  children,
  colors = ['#00C897', '#00A8FF', '#7C5CFC'],
  style,
  padded = true,
}: AnimatedGradientCardProps) {
  const reduced = useReducedMotion();
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (reduced) return;
    rotation.value = withRepeat(
      withTiming(360, { duration: 12000, easing: Easing.linear }),
      -1,
      false,
    );
  }, [reduced, rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={[styles.wrap, shadows.md, style]}>
      <View style={styles.clip}>
        <Animated.View style={[styles.gradientLayer, animatedStyle]}>
          <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>
      <View style={[styles.content, padded && styles.padded]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderRadius: radius.card, backgroundColor: 'transparent' },
  clip: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radius.card,
    overflow: 'hidden',
  },
  gradientLayer: {
    position: 'absolute',
    // Oversize so rotation never reveals the corners.
    top: '-75%',
    left: '-75%',
    right: '-75%',
    bottom: '-75%',
  },
  content: { borderRadius: radius.card },
  padded: { padding: 20 },
});

export const AnimatedGradientCard = memo(AnimatedGradientCardComponent);
