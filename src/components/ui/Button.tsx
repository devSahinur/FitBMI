import React, { memo } from 'react';
import {
  Pressable,
  ActivityIndicator,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { palette, radius, shadows } from '@/theme';
import { useTheme } from '@/hooks/useTheme';
import { useHaptics } from '@/hooks/useHaptics';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function ButtonComponent({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
  fullWidth = true,
  style,
}: ButtonProps) {
  const { colors } = useTheme();
  const haptic = useHaptics();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isGradient = variant === 'primary' || variant === 'secondary';
  const gradientColors =
    variant === 'secondary'
      ? ([palette.secondary, palette.secondaryDark] as const)
      : ([palette.primary, palette.primaryDark] as const);

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };
  const handlePress = () => {
    if (disabled || loading) return;
    haptic('medium');
    onPress?.();
  };

  const content = (
    <View style={styles.content}>
      {loading ? (
        <ActivityIndicator color={isGradient ? '#fff' : colors.primary} />
      ) : (
        <>
          {icon}
          <Text
            variant="title"
            style={{
              color:
                variant === 'ghost' || variant === 'outline'
                  ? colors.primary
                  : '#fff',
            }}
          >
            {title}
          </Text>
        </>
      )}
    </View>
  );

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[
        animatedStyle,
        fullWidth && styles.fullWidth,
        { opacity: disabled ? 0.5 : 1 },
        style,
      ]}
    >
      {isGradient ? (
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.base, shadows.glow]}
        >
          {content}
        </LinearGradient>
      ) : (
        <View
          style={[
            styles.base,
            variant === 'outline' && {
              borderWidth: 1.5,
              borderColor: colors.primary,
            },
            variant === 'ghost' && { backgroundColor: colors.surfaceAlt },
          ]}
        >
          {content}
        </View>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  fullWidth: { width: '100%' },
  base: {
    height: 54,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

export const Button = memo(ButtonComponent);
