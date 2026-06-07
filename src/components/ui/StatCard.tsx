import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { icons } from 'lucide-react-native';
import { AnimatedCard } from './AnimatedCard';
import { AnimatedCounter } from './AnimatedCounter';
import { Text } from './Text';
import { useTheme } from '@/hooks/useTheme';

interface StatCardProps {
  label: string;
  value: number;
  unit?: string;
  decimals?: number;
  icon: keyof typeof icons;
  color?: string;
  index?: number;
  delta?: number; // optional trend %
}

/** Animated metric tile: icon, animated value, optional trend indicator. */
function StatCardComponent({
  label,
  value,
  unit,
  decimals = 0,
  icon,
  color,
  index = 0,
  delta,
}: StatCardProps) {
  const { colors } = useTheme();
  const Icon = icons[icon] ?? icons.Activity;
  const accent = color ?? colors.primary;
  const trendUp = (delta ?? 0) >= 0;

  return (
    <AnimatedCard index={index} style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: `${accent}22` }]}>
        <Icon size={20} color={accent} />
      </View>
      <View style={styles.row}>
        <AnimatedCounter
          value={value}
          decimals={decimals}
          variant="h3"
          suffix={unit ? ` ${unit}` : ''}
        />
      </View>
      <Text variant="label" tone="muted">
        {label}
      </Text>
      {delta !== undefined && (
        <Text
          variant="caption"
          style={{ color: trendUp ? colors.primary : colors.secondary }}
        >
          {trendUp ? '▲' : '▼'} {Math.abs(delta).toFixed(1)}%
        </Text>
      )}
    </AnimatedCard>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, minHeight: 120, justifyContent: 'space-between' },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { marginTop: 8 },
});

export const StatCard = memo(StatCardComponent);
