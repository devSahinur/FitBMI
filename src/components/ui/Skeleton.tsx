import React, { memo } from 'react';
import { StyleSheet, type ViewStyle, type DimensionValue } from 'react-native';
import { MotiView } from 'moti';
import { useTheme } from '@/hooks/useTheme';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { radius } from '@/theme';
import { GlassCard } from './GlassCard';

interface SkeletonProps {
  width?: DimensionValue;
  height?: number;
  radius?: number;
  style?: ViewStyle;
}

/** Shimmering placeholder block (respects reduced motion). */
function SkeletonComponent({
  width = '100%',
  height = 16,
  radius: r = 8,
  style,
}: SkeletonProps) {
  const { colors } = useTheme();
  const reduced = useReducedMotion();
  return (
    <MotiView
      from={{ opacity: 0.5 }}
      animate={{ opacity: reduced ? 0.5 : 1 }}
      transition={{
        loop: !reduced,
        type: 'timing',
        duration: 800,
      }}
      style={[
        { width, height, borderRadius: r, backgroundColor: colors.surfaceAlt },
        style,
      ]}
    />
  );
}

export const Skeleton = memo(SkeletonComponent);

/** A glass card filled with skeleton lines — drop-in loading state. */
function SkeletonCardComponent({ lines = 3 }: { lines?: number }) {
  return (
    <GlassCard style={styles.card}>
      <Skeleton width={'40%'} height={20} />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} width={i === lines - 1 ? '70%' : '100%'} height={12} />
      ))}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: { gap: 10, borderRadius: radius.card },
});

export const SkeletonCard = memo(SkeletonCardComponent);
