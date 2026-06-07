import React, { memo, useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Plus } from 'lucide-react-native';
import { palette, shadows } from '@/theme';
import { useHaptics } from '@/hooks/useHaptics';

interface FABProps {
  onPress: () => void;
  icon?: React.ReactNode;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** Floating action button with a subtle idle pulse and press spring. */
function FABComponent({ onPress, icon }: FABProps) {
  const scale = useSharedValue(1);
  const pulse = useSharedValue(1);
  const haptic = useHaptics();

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: 1200 }),
        withTiming(1, { duration: 1200 }),
      ),
      -1,
      true,
    );
  }, [pulse]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * pulse.value }],
  }));

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel="Add entry"
      onPressIn={() => (scale.value = withSpring(0.9))}
      onPressOut={() => (scale.value = withSpring(1))}
      onPress={() => {
        haptic('medium');
        onPress();
      }}
      style={[styles.wrap, style, shadows.glow]}
    >
      <LinearGradient
        colors={[palette.primary, palette.secondary]}
        style={styles.gradient}
      >
        {icon ?? <Plus size={28} color="#fff" />}
      </LinearGradient>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    borderRadius: 32,
  },
  gradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const FAB = memo(FABComponent);
