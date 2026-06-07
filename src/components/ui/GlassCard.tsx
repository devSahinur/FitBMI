import React, { memo } from 'react';
import {
  View,
  StyleSheet,
  type ViewProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/hooks/useTheme';
import { radius, shadows } from '@/theme';

interface GlassCardProps extends ViewProps {
  intensity?: number;
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Frosted-glass card: a blurred translucent surface with a hairline border
 * and soft shadow. The backbone of the glassmorphism design system.
 */
function GlassCardComponent({
  children,
  intensity = 40,
  padded = true,
  style,
  ...rest
}: GlassCardProps) {
  const { isDark, colors } = useTheme();

  return (
    <View
      style={[styles.shadow, { borderRadius: radius.card }, shadows.md, style]}
      {...rest}
    >
      <BlurView
        intensity={intensity}
        tint={isDark ? 'dark' : 'light'}
        style={[styles.blur, { borderRadius: radius.card }]}
      >
        <View
          style={[
            styles.inner,
            {
              backgroundColor: colors.glass,
              borderColor: colors.glassBorder,
              padding: padded ? 16 : 0,
            },
          ]}
        >
          {children}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    backgroundColor: 'transparent',
  },
  blur: {
    overflow: 'hidden',
  },
  inner: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.card,
  },
});

export const GlassCard = memo(GlassCardComponent);
