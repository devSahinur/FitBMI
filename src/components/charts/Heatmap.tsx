import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { palette } from '@/theme';
import { useTheme } from '@/hooks/useTheme';
import { Text } from '@/components/ui/Text';

interface HeatmapProps {
  /** Intensities 0..1, oldest-first; rendered in columns of 7 (weeks). */
  values: number[];
  title?: string;
}

const CELL = 14;
const GAP = 3;

/** GitHub-style activity heatmap (no native deps). */
function HeatmapComponent({ values, title }: HeatmapProps) {
  const { colors } = useTheme();
  const weeks: number[][] = [];
  for (let i = 0; i < values.length; i += 7) {
    weeks.push(values.slice(i, i + 7));
  }

  return (
    <View style={{ gap: 8 }}>
      {title ? <Text variant="title">{title}</Text> : null}
      <View style={styles.row}>
        {weeks.map((week, wi) => (
          <View key={wi} style={styles.col}>
            {week.map((v, di) => (
              <View
                key={di}
                style={[
                  styles.cell,
                  {
                    backgroundColor:
                      v <= 0
                        ? colors.surfaceAlt
                        : palette.primary,
                    opacity: v <= 0 ? 1 : 0.25 + v * 0.75,
                  },
                ]}
              />
            ))}
          </View>
        ))}
      </View>
      <View style={styles.legend}>
        <Text variant="label" tone="muted">
          Less
        </Text>
        {[0, 0.35, 0.6, 0.85, 1].map((v, i) => (
          <View
            key={i}
            style={[
              styles.cell,
              {
                backgroundColor: v <= 0 ? colors.surfaceAlt : palette.primary,
                opacity: v <= 0 ? 1 : 0.25 + v * 0.75,
              },
            ]}
          />
        ))}
        <Text variant="label" tone="muted">
          More
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: GAP, flexWrap: 'wrap' },
  col: { gap: GAP },
  cell: { width: CELL, height: CELL, borderRadius: 3 },
  legend: { flexDirection: 'row', alignItems: 'center', gap: GAP },
});

export const Heatmap = memo(HeatmapComponent);
