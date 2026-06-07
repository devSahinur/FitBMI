import React, { useMemo } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { ModalHeader } from '@/components/layout/ModalHeader';
import { AIToolView } from '@/components/ai/AIToolView';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/useTheme';
import { useAIContext } from '@/hooks/useAIContext';
import { getWeeklyReport } from '@/services/ai.service';
import { useHealthStore } from '@/store/health.store';
import { useAchievementsStore } from '@/store/achievements.store';
import { ACHIEVEMENTS } from '@/constants';
import { lastNDays } from '@/utils/date';
import { average, round } from '@/utils';

export function WeeklyReportScreen() {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const ctx = useAIContext();
  const entries = useHealthStore((s) => s.entries);
  const unlocked = useAchievementsStore((s) => s.unlocked);

  const stats = useMemo(() => {
    const days = lastNDays(7);
    const present = days.map((d) => entries[d]).filter(Boolean);
    const weights = present
      .map((e) => e?.weightKg)
      .filter((v): v is number => typeof v === 'number');
    const weightChangeKg =
      weights.length >= 2 ? round(weights[weights.length - 1]! - weights[0]!, 1) : 0;
    return {
      weightChangeKg,
      bmiNow: ctx.bmi,
      avgSleep: round(
        average(
          present
            .map((e) => e?.sleepHours)
            .filter((v): v is number => typeof v === 'number'),
        ),
        1,
      ),
      avgWaterMl: Math.round(
        average(
          present
            .map((e) => e?.waterMl)
            .filter((v): v is number => typeof v === 'number'),
        ),
      ),
      avgSteps: Math.round(
        average(
          present
            .map((e) => e?.steps)
            .filter((v): v is number => typeof v === 'number'),
        ),
      ),
      daysLogged: present.length,
      achievements: ACHIEVEMENTS.filter((a) => unlocked[a.id]).map((a) => a.title),
    };
  }, [entries, unlocked, ctx.bmi]);

  const bg = isDark
    ? (['#0B0F1A', '#0E1626'] as const)
    : (['#F4F6FA', '#EAF0FA'] as const);

  return (
    <LinearGradient colors={bg} style={{ flex: 1 }}>
      <ModalHeader title="Weekly AI Report" />
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: insets.bottom + 32,
          gap: 12,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="body" tone="muted">
          A personalised summary of your week — weight & BMI trends, habits,
          achievements and suggestions. Use Share to save or print as PDF.
        </Text>
        <AIToolView
          title="Weekly report"
          queryKey={[
            'ai',
            'report',
            stats.daysLogged,
            stats.weightChangeKg,
            stats.avgSleep,
          ]}
          run={(signal) => getWeeklyReport(ctx, stats, signal)}
          generateLabel="Generate report"
          xpReward={25}
        />
      </ScrollView>
    </LinearGradient>
  );
}
