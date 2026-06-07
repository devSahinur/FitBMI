import React, { memo } from 'react';
import { View } from 'react-native';
import { CircularProgress } from './CircularProgress';
import { Text } from './Text';

interface ProgressRingProps {
  label: string;
  value: number;
  goal: number;
  unit?: string;
  color?: string;
  size?: number;
}

/** Compact labelled progress ring used in the Health Tracker grid. */
function ProgressRingComponent({
  label,
  value,
  goal,
  unit = '',
  color,
  size = 96,
}: ProgressRingProps) {
  const pct = goal > 0 ? value / goal : 0;
  return (
    <View style={{ alignItems: 'center', gap: 8 }}>
      <CircularProgress
        progress={pct}
        size={size}
        strokeWidth={10}
        color={color}
      >
        <Text variant="title">{Math.round(pct * 100)}%</Text>
      </CircularProgress>
      <View style={{ alignItems: 'center' }}>
        <Text variant="label" tone="muted">
          {label}
        </Text>
        <Text variant="caption">
          {Math.round(value)}
          {unit} / {goal}
          {unit}
        </Text>
      </View>
    </View>
  );
}

export const ProgressRing = memo(ProgressRingComponent);
