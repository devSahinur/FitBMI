import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { icons } from 'lucide-react-native';
import { palette } from '@/theme';
import { useTheme } from '@/hooks/useTheme';
import { Text } from './Text';

interface BadgeProps {
  title: string;
  description: string;
  icon: string; // lucide icon name
  unlocked: boolean;
  index?: number;
}

/** Achievement badge with a locked/unlocked state and entrance animation. */
function BadgeComponent({
  title,
  description,
  icon,
  unlocked,
  index = 0,
}: BadgeProps) {
  const { colors } = useTheme();
  const LucideIcon =
    (icons as Record<string, React.ComponentType<{ size?: number; color?: string }>>)[
      toPascal(icon)
    ] ?? icons.Award;

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', delay: index * 90, damping: 12 }}
      style={[styles.wrap, { backgroundColor: colors.surface }]}
    >
      {unlocked ? (
        <LinearGradient
          colors={[palette.primary, palette.secondary]}
          style={styles.iconCircle}
        >
          <LucideIcon size={26} color="#fff" />
        </LinearGradient>
      ) : (
        <View style={[styles.iconCircle, { backgroundColor: colors.surfaceAlt }]}>
          <LucideIcon size={26} color={colors.textMuted} />
        </View>
      )}
      <Text variant="label" style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <Text variant="caption" tone="muted" style={styles.desc} numberOfLines={2}>
        {description}
      </Text>
    </MotiView>
  );
}

function toPascal(kebab: string): string {
  return kebab
    .split('-')
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join('');
}

const styles = StyleSheet.create({
  wrap: {
    width: 150,
    borderRadius: 20,
    padding: 14,
    alignItems: 'center',
    gap: 6,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { textAlign: 'center' },
  desc: { textAlign: 'center', minHeight: 32 },
});

export const Badge = memo(BadgeComponent);
