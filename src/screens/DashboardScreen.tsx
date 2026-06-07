import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { ModalHeader } from '@/components/layout/ModalHeader';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatCard } from '@/components/ui/StatCard';
import { TrendChart } from '@/components/charts/TrendChart';
import { Heatmap } from '@/components/charts/Heatmap';
import { useTheme } from '@/hooks/useTheme';
import { useHealthStore } from '@/store/health.store';
import { useProfileStore } from '@/store/profile.store';
import { calculateBMI } from '@/utils/bmi';
import { lastNDays } from '@/utils/date';
import { average } from '@/utils/stats';
import { clamp, round } from '@/utils/bmi';
import type { ChartPoint } from '@/types';

export function DashboardScreen() {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const entries = useHealthStore((s) => s.entries);
  const { profile, goals } = useProfileStore();

  const data = useMemo(() => {
    const dayCompletion = (key: string): number => {
      const e = entries[key];
      if (!e) return 0;
      const parts = [
        e.waterMl ? clamp(e.waterMl / goals.waterMlPerDay, 0, 1) : 0,
        e.steps ? clamp(e.steps / goals.stepsPerDay, 0, 1) : 0,
        e.sleepHours ? clamp(e.sleepHours / goals.sleepHoursPerDay, 0, 1) : 0,
      ];
      return clamp(0.3 + average(parts) * 0.7, 0.3, 1);
    };

    const last84 = lastNDays(84).map(dayCompletion);
    const last7 = lastNDays(7).map(dayCompletion);
    const last30 = lastNDays(30);

    const present30 = last30.map((d) => entries[d]).filter(Boolean);
    const weightSeries: ChartPoint[] = last30.map((d, i) => ({
      x: i,
      y: entries[d]?.weightKg ?? 0,
    }));

    const today = entries[lastNDays(1)[0]!];
    const heartPoints = today
      ? Math.round(
          (today.steps ?? 0) / 200 +
            (today.sleepHours ?? 0) * 3 +
            clamp((today.waterMl ?? 0) / goals.waterMlPerDay, 0, 1) * 10,
        )
      : 0;

    return {
      heatmap: last84,
      weeklyScore: Math.round(average(last7) * 100),
      monthlyScore: Math.round(average(lastNDays(30).map(dayCompletion)) * 100),
      avgSleep: round(
        average(
          present30
            .map((e) => e?.sleepHours)
            .filter((v): v is number => typeof v === 'number'),
        ),
        1,
      ),
      avgWater: Math.round(
        average(
          present30
            .map((e) => e?.waterMl)
            .filter((v): v is number => typeof v === 'number'),
        ),
      ),
      avgCalories: Math.round(
        average(
          present30
            .map((e) => e?.calories)
            .filter((v): v is number => typeof v === 'number'),
        ),
      ),
      avgSteps: Math.round(
        average(
          present30
            .map((e) => e?.steps)
            .filter((v): v is number => typeof v === 'number'),
        ),
      ),
      weightSeries: weightSeries.filter((p) => p.y > 0),
      heartPoints,
    };
  }, [entries, goals]);

  const bmi = calculateBMI(profile.currentWeightKg, profile.heightCm).bmi;

  const tiles: {
    label: string;
    value: number;
    unit?: string;
    decimals?: number;
    icon: React.ComponentProps<typeof StatCard>['icon'];
  }[] = [
    { label: 'Weight', value: profile.currentWeightKg, unit: 'kg', decimals: 1, icon: 'Scale' },
    { label: 'BMI', value: bmi, decimals: 1, icon: 'HeartPulse' },
    { label: 'Avg Calories', value: data.avgCalories, icon: 'Flame' },
    { label: 'Avg Sleep', value: data.avgSleep, unit: 'h', decimals: 1, icon: 'Moon' },
    { label: 'Avg Water', value: data.avgWater, unit: 'ml', icon: 'Droplets' },
    { label: 'Avg Steps', value: data.avgSteps, icon: 'Footprints' },
    { label: 'Heart Points', value: data.heartPoints, icon: 'Heart' },
    { label: 'Weekly Score', value: data.weeklyScore, unit: '%', icon: 'Gauge' },
    { label: 'Monthly Score', value: data.monthlyScore, unit: '%', icon: 'CalendarCheck' },
  ];

  const bg = isDark
    ? (['#0B0F1A', '#0E1626'] as const)
    : (['#F4F6FA', '#EAF0FA'] as const);

  return (
    <LinearGradient colors={bg} style={{ flex: 1 }}>
      <ModalHeader title="Health Dashboard" />
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: insets.bottom + 32,
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {tiles.map((t, i) => (
            <View key={t.label} style={styles.cell}>
              <StatCard
                label={t.label}
                value={t.value}
                unit={t.unit}
                decimals={t.decimals ?? 0}
                icon={t.icon}
                index={i}
              />
            </View>
          ))}
        </View>

        <GlassCard>
          <Heatmap values={data.heatmap} title="Activity (12 weeks)" />
        </GlassCard>

        <GlassCard>
          <TrendChart data={data.weightSeries} title="Weight progression" />
        </GlassCard>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  cell: { width: '47%', flexGrow: 1 },
});
