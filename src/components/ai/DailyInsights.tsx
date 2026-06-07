import React, { memo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { MotiView } from 'moti';

import { GlassCard } from '@/components/ui/GlassCard';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { useAIContext } from '@/hooks/useAIContext';
import { getDailyInsights, hasApiKey } from '@/services/ai.service';
import { toDateKey } from '@/utils/date';

/** Daily AI insight cards (motivation, tip, fact, summary) for the Home screen. */
function DailyInsightsComponent() {
  const ctx = useAIContext();
  const dayKey = toDateKey();

  const { data, isFetching } = useQuery({
    queryKey: ['ai', 'insights', dayKey, ctx.bmiCategory],
    queryFn: ({ signal }) => getDailyInsights(ctx, signal),
    enabled: hasApiKey(),
    staleTime: 12 * 60 * 60 * 1000, // half a day
    retry: 0,
  });

  if (!hasApiKey()) return null;

  return (
    <View style={{ gap: 8 }}>
      <SectionHeader title="AI Insights" />
      {isFetching && !data ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.row}
        >
          <View style={styles.card}>
            <SkeletonCard lines={2} />
          </View>
          <View style={styles.card}>
            <SkeletonCard lines={2} />
          </View>
        </ScrollView>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.row}
        >
          {(data ?? []).map((ins, i) => (
            <MotiView
              key={ins.id}
              from={{ opacity: 0, translateX: 16 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ type: 'timing', duration: 350, delay: i * 80 }}
            >
              <GlassCard style={styles.card}>
                <Text style={styles.emoji}>{ins.emoji}</Text>
                <Text variant="title" numberOfLines={1}>
                  {ins.title}
                </Text>
                <Text variant="caption" tone="muted">
                  {ins.body}
                </Text>
              </GlassCard>
            </MotiView>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { gap: 12, paddingRight: 8 },
  card: { width: 220, minHeight: 120, gap: 4 },
  emoji: { fontSize: 24 },
});

export const DailyInsights = memo(DailyInsightsComponent);
