import React, { memo } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { radius } from '@/theme';
import { useHaptics } from '@/hooks/useHaptics';
import { Text } from './Text';

interface ChipProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
  color?: string;
}

/** Selectable filter chip. */
function ChipComponent({ label, active = false, onPress, color }: ChipProps) {
  const { colors } = useTheme();
  const haptic = useHaptics();
  const accent = color ?? colors.primary;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={() => {
        haptic('light');
        onPress?.();
      }}
      style={[
        styles.chip,
        {
          backgroundColor: active ? accent : colors.surfaceAlt,
        },
      ]}
    >
      <Text
        variant="label"
        style={{ color: active ? '#fff' : colors.textMuted }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
});

export const Chip = memo(ChipComponent);
