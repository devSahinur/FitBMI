import React, { memo, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Share2, RefreshCw, Sparkles } from 'lucide-react-native';

import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { Markdown } from './Markdown';
import { useTheme } from '@/hooks/useTheme';
import { ExportService } from '@/services/export.service';
import { hasApiKey } from '@/services/openrouter.service';
import { HEALTH_DISCLAIMER } from '@/features/ai/prompts';
import { useGamificationStore } from '@/store/gamification.store';

interface AIToolViewProps {
  title: string;
  /** Stable React Query key; include any control params for correct caching. */
  queryKey: unknown[];
  run: (signal?: AbortSignal) => Promise<string>;
  /** Optional control UI (selectors) rendered above the Generate button. */
  controls?: React.ReactNode;
  generateLabel?: string;
  /** XP awarded the first time a result is produced. */
  xpReward?: number;
}

/**
 * Shared AI generator surface: controls → Generate → cached markdown result,
 * with regenerate + share. Uses React Query so results cache per queryKey.
 */
function AIToolViewComponent({
  title,
  queryKey,
  run,
  controls,
  generateLabel = 'Generate',
  xpReward = 10,
}: AIToolViewProps) {
  const { colors } = useTheme();
  const [enabled, setEnabled] = useState(false);
  const awardXp = useGamificationStore((s) => s.awardXp);

  const { data, isFetching, error, refetch } = useQuery({
    queryKey,
    queryFn: async ({ signal }) => {
      const result = await run(signal);
      awardXp(xpReward, title);
      return result;
    },
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: 0,
  });

  const generate = () => {
    if (enabled) refetch();
    else setEnabled(true);
  };

  const noKey = !hasApiKey();

  return (
    <View style={{ gap: 12 }}>
      {controls}

      {!data && (
        <Button
          title={generateLabel}
          onPress={generate}
          loading={isFetching}
          icon={<Sparkles size={18} color="#fff" />}
        />
      )}

      {noKey && (
        <GlassCard>
          <Text variant="title">AI key required</Text>
          <Text variant="caption" tone="muted">
            Add EXPO_PUBLIC_OPENROUTER_API_KEY to your .env (see .env.example)
            and restart the dev server to use AI features.
          </Text>
        </GlassCard>
      )}

      {isFetching && !data && (
        <GlassCard>
          <View style={styles.loading}>
            <ActivityIndicator color={colors.primary} />
            <Text variant="body" tone="muted">
              Thinking…
            </Text>
          </View>
        </GlassCard>
      )}

      {error && !isFetching && (
        <GlassCard>
          <Text variant="title" style={{ color: colors.secondary }}>
            Couldn’t generate
          </Text>
          <Text variant="caption" tone="muted">
            {error instanceof Error ? error.message : 'Please try again.'}
          </Text>
        </GlassCard>
      )}

      {data && (
        <GlassCard>
          <Markdown content={data} />
          <View style={styles.actions}>
            <Button
              title="Regenerate"
              variant="ghost"
              fullWidth={false}
              icon={<RefreshCw size={16} color={colors.primary} />}
              onPress={() => refetch()}
              loading={isFetching}
            />
            <Button
              title="Share"
              variant="outline"
              fullWidth={false}
              icon={<Share2 size={16} color={colors.primary} />}
              onPress={() => void ExportService.shareText(data)}
            />
          </View>
          <Text variant="label" tone="muted" style={styles.disclaimer}>
            {HEALTH_DISCLAIMER}
          </Text>
        </GlassCard>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loading: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 12, flexWrap: 'wrap' },
  disclaimer: { marginTop: 10 },
});

export const AIToolView = memo(AIToolViewComponent);
