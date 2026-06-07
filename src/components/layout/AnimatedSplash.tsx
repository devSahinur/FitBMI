import React, { memo, useEffect } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { HeartPulse } from 'lucide-react-native';
import { palette } from '@/theme';
import { Text } from '@/components/ui/Text';

interface AnimatedSplashProps {
  /** App finished bootstrapping; play the exit animation. */
  ready: boolean;
  onFinish: () => void;
}

/**
 * Branded animated splash overlay. Logo springs in and pulses while the app
 * boots, then the whole overlay fades/zooms out and unmounts via onFinish.
 */
function AnimatedSplashComponent({ ready, onFinish }: AnimatedSplashProps) {
  const { width } = useWindowDimensions();
  const logoScale = useSharedValue(0.4);
  const logoOpacity = useSharedValue(0);
  const pulse = useSharedValue(1);
  const overlayOpacity = useSharedValue(1);
  const overlayScale = useSharedValue(1);

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 500 });
    logoScale.value = withSpring(1, { damping: 10, stiffness: 120 });
    pulse.value = withDelay(
      500,
      withRepeat(
        withSequence(
          withTiming(1.08, { duration: 700, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 700, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      ),
    );
  }, [logoOpacity, logoScale, pulse]);

  useEffect(() => {
    if (!ready) return;
    overlayScale.value = withDelay(300, withTiming(1.15, { duration: 500 }));
    overlayOpacity.value = withDelay(
      300,
      withTiming(0, { duration: 500 }, (finished) => {
        if (finished) runOnJS(onFinish)();
      }),
    );
  }, [ready, overlayOpacity, overlayScale, onFinish]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
    transform: [{ scale: overlayScale.value }],
  }));
  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value * pulse.value }],
  }));

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.container, overlayStyle]}>
      <LinearGradient colors={['#0B0F1A', '#111827']} style={StyleSheet.absoluteFill} />
      <Animated.View style={[styles.logoWrap, logoStyle]}>
        <LinearGradient
          colors={[palette.primary, palette.secondary]}
          style={[styles.logo, { width: width * 0.32, height: width * 0.32 }]}
        >
          <HeartPulse size={width * 0.16} color="#fff" />
        </LinearGradient>
      </Animated.View>
      <Animated.View style={logoStyle}>
        <Text variant="h1" style={styles.title}>
          FitBMI
        </Text>
        <Text variant="caption" style={styles.subtitle}>
          BMI Calculator & Health Tracker
        </Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', gap: 20, zIndex: 100 },
  logoWrap: { marginBottom: 8 },
  logo: { borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
  title: { color: '#fff', textAlign: 'center' },
  subtitle: { color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginTop: 4 },
});

export const AnimatedSplash = memo(AnimatedSplashComponent);
