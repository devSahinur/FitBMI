import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { MotiView } from 'moti';
import { useTheme } from '@/hooks/useTheme';
import { useHaptics } from '@/hooks/useHaptics';
import { radius } from '@/theme';
import { Text } from './Text';

interface Segment<T extends string> {
  label: string;
  value: T;
}

interface SegmentedControlProps<T extends string> {
  segments: Segment<T>[];
  value: T;
  onChange: (value: T) => void;
}

/** Animated pill segmented control (e.g. Metric / Imperial). */
function SegmentedControlInner<T extends string>({
  segments,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  const { colors } = useTheme();
  const haptic = useHaptics();
  const activeIndex = Math.max(
    0,
    segments.findIndex((s) => s.value === value),
  );
  const widthPct = 100 / segments.length;

  return (
    <View
      style={[styles.track, { backgroundColor: colors.surfaceAlt }]}
      accessibilityRole="tablist"
    >
      <MotiView
        animate={{ left: `${activeIndex * widthPct}%` }}
        transition={{ type: 'spring', damping: 18, stiffness: 200 }}
        style={[
          styles.thumb,
          { width: `${widthPct}%`, backgroundColor: colors.primary },
        ]}
      />
      {segments.map((s) => {
        const selected = s.value === value;
        return (
          <Pressable
            key={s.value}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            style={styles.segment}
            onPress={() => {
              haptic('light');
              onChange(s.value);
            }}
          >
            <Text
              variant="label"
              style={{ color: selected ? '#fff' : colors.textMuted }}
            >
              {s.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    borderRadius: radius.pill,
    padding: 4,
    position: 'relative',
  },
  thumb: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    borderRadius: radius.pill,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const SegmentedControl = memo(
  SegmentedControlInner,
) as typeof SegmentedControlInner;
