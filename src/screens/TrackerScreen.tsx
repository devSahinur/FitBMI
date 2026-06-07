import React, { useMemo, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Plus, Scale, Droplets, Moon, Flame, Footprints } from 'lucide-react-native';

import {
  ScreenContainer,
  SectionHeader,
  AnimatedCard,
  GlassCard,
  ProgressRing,
  StatCard,
  TrendChart,
  Chip,
  ExpandableFAB,
  Sheet,
  Field,
  Button,
  Text,
  type FABAction,
  type SheetRef,
} from '@/components';
import { palette } from '@/theme';
import { useHaptics } from '@/hooks/useHaptics';
import { useStreak } from '@/hooks/useStreak';
import { useHealthStore } from '@/store/health.store';
import { useProfileStore } from '@/store/profile.store';
import { useAchievementsStore } from '@/store/achievements.store';
import {
  useGamificationStore,
  DAILY_CHALLENGES,
} from '@/store/gamification.store';
import { lastNDays, toDateKey } from '@/utils/date';
import { average, trendPct } from '@/utils/stats';
import { calculateBMI } from '@/utils/bmi';
import type { ChartPoint } from '@/types';

type Metric = 'weight' | 'bmi' | 'water' | 'sleep';
type Range = 7 | 30;

export function TrackerScreen() {
  const haptic = useHaptics();
  const sheetRef = useRef<SheetRef>(null);

  const entries = useHealthStore((s) => s.entries);
  // Derive (don't select) the sorted list — selecting it would return a new
  // array reference each render and trigger a useSyncExternalStore loop.
  const sorted = useMemo(
    () =>
      Object.values(entries).sort((a, b) => a.date.localeCompare(b.date)),
    [entries],
  );
  const upsert = useHealthStore((s) => s.upsert);
  const increment = useHealthStore((s) => s.increment);
  const { profile, goals } = useProfileStore();
  const unlock = useAchievementsStore((s) => s.unlock);
  const streak = useStreak();

  const [metric, setMetric] = useState<Metric>('weight');
  const [range, setRange] = useState<Range>(7);

  const today = entries[toDateKey()];

  // Draft state for the logging sheet
  const [draft, setDraft] = useState({
    weight: '',
    bodyFat: '',
    water: '',
    calories: '',
    sleep: '',
    steps: '',
  });

  const chartData: ChartPoint[] = useMemo(() => {
    const days = lastNDays(range);
    return days.map((day, idx) => {
      const e = entries[day];
      let y = 0;
      if (e) {
        if (metric === 'weight') y = e.weightKg ?? 0;
        else if (metric === 'water') y = e.waterMl ?? 0;
        else if (metric === 'sleep') y = e.sleepHours ?? 0;
        else if (metric === 'bmi')
          y = e.weightKg
            ? calculateBMI(e.weightKg, profile.heightCm).bmi
            : 0;
      }
      return { x: idx, y, label: day };
    });
  }, [entries, metric, range, profile.heightCm]);

  const weightSeries = sorted.map((e) => e.weightKg ?? 0).filter(Boolean);
  const avgSleep = average(sorted.map((e) => e.sleepHours ?? 0).filter(Boolean));
  const weightTrend = trendPct(weightSeries);

  const openSheet = () => {
    haptic('medium');
    setDraft({
      weight: today?.weightKg ? String(today.weightKg) : '',
      bodyFat: today?.bodyFatPct ? String(today.bodyFatPct) : '',
      water: today?.waterMl ? String(today.waterMl) : '',
      calories: today?.calories ? String(today.calories) : '',
      sleep: today?.sleepHours ? String(today.sleepHours) : '',
      steps: today?.steps ? String(today.steps) : '',
    });
    sheetRef.current?.present();
  };

  const saveDraft = () => {
    const num = (v: string) => (v.trim() === '' ? undefined : Number(v));
    upsert({
      weightKg: num(draft.weight),
      bodyFatPct: num(draft.bodyFat),
      waterMl: num(draft.water),
      calories: num(draft.calories),
      sleepHours: num(draft.sleep),
      steps: num(draft.steps),
    });
    // Achievement checks
    if ((num(draft.water) ?? 0) >= goals.waterMlPerDay) unlock('water-goal');
    if (streak + 1 >= 7) unlock('streak-7');
    if (streak + 1 >= 30) unlock('streak-30');

    // Gamification: daily check-in + challenge completion
    const gam = useGamificationStore.getState();
    gam.checkIn();
    if (num(draft.weight) !== undefined)
      gam.completeChallenge(DAILY_CHALLENGES[0]!); // log weight
    if ((num(draft.water) ?? 0) >= goals.waterMlPerDay)
      gam.completeChallenge(DAILY_CHALLENGES[1]!); // hit water
    if (num(draft.sleep) !== undefined)
      gam.completeChallenge(DAILY_CHALLENGES[3]!); // log sleep

    haptic('success');
    sheetRef.current?.dismiss();
  };

  const fabActions: FABAction[] = [
    { label: 'Add Weight', icon: Scale, color: palette.primary, onPress: openSheet },
    {
      label: '+250ml Water',
      icon: Droplets,
      color: palette.secondary,
      onPress: () => {
        increment('waterMl', 250);
        haptic('success');
      },
    },
    { label: 'Add Sleep', icon: Moon, color: '#9D7BFF', onPress: openSheet },
    { label: 'Add Calories', icon: Flame, color: palette.warning, onPress: openSheet },
    {
      label: '+1000 Steps',
      icon: Footprints,
      color: palette.accent,
      onPress: () => {
        increment('steps', 1000);
        haptic('success');
      },
    },
  ];

  return (
    <View style={styles.fill}>
      <ScreenContainer>
      <SectionHeader title="Health Tracker" />

      {/* Streak */}
      <AnimatedCard index={0} style={styles.streakCard}>
        <View>
          <Text variant="label" tone="muted">
            Current streak
          </Text>
          <Text variant="h1" tone="primary">
            {streak} 🔥
          </Text>
        </View>
        <Text variant="caption" tone="muted" style={{ flex: 1, textAlign: 'right' }}>
          Log daily to keep your streak alive
        </Text>
      </AnimatedCard>

      {/* Progress rings */}
      <AnimatedCard index={1}>
        <SectionHeader title="Today" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.rings}
        >
          <ProgressRing
            label="Water"
            value={today?.waterMl ?? 0}
            goal={goals.waterMlPerDay}
            unit="ml"
            color={palette.secondary}
          />
          <ProgressRing
            label="Steps"
            value={today?.steps ?? 0}
            goal={goals.stepsPerDay}
            color={palette.primary}
          />
          <ProgressRing
            label="Calories"
            value={today?.calories ?? 0}
            goal={goals.caloriesPerDay}
            unit=""
            color={palette.overweight}
          />
          <ProgressRing
            label="Sleep"
            value={today?.sleepHours ?? 0}
            goal={goals.sleepHoursPerDay}
            unit="h"
            color="#9D7BFF"
          />
        </ScrollView>
      </AnimatedCard>

      {/* Stats cards */}
      <View style={styles.statGrid}>
        <View style={styles.statItem}>
          <StatCard
            label="Body Fat"
            value={today?.bodyFatPct ?? 0}
            unit="%"
            decimals={1}
            icon="Percent"
            index={0}
          />
        </View>
        <View style={styles.statItem}>
          <StatCard
            label="Avg Sleep"
            value={avgSleep}
            unit="h"
            decimals={1}
            icon="Moon"
            index={1}
          />
        </View>
        <View style={styles.statItem}>
          <StatCard
            label="Weight"
            value={profile.currentWeightKg}
            unit="kg"
            decimals={1}
            icon="Scale"
            index={2}
            delta={weightTrend}
          />
        </View>
        <View style={styles.statItem}>
          <StatCard
            label="Steps"
            value={today?.steps ?? 0}
            icon="Footprints"
            index={3}
          />
        </View>
      </View>

      {/* Charts */}
      <GlassCard>
        <SectionHeader title="Trends" />
        <View style={styles.chartControls}>
          <View style={styles.chips}>
            {(['weight', 'bmi', 'water', 'sleep'] as Metric[]).map((m) => (
              <Chip
                key={m}
                label={m.toUpperCase()}
                active={metric === m}
                onPress={() => setMetric(m)}
              />
            ))}
          </View>
          <View style={styles.chips}>
            <Chip
              label="Weekly"
              active={range === 7}
              onPress={() => setRange(7)}
            />
            <Chip
              label="Monthly"
              active={range === 30}
              onPress={() => setRange(30)}
            />
          </View>
        </View>
        <TrendChart
          data={chartData}
          color={metric === 'water' ? palette.secondary : palette.primary}
        />
      </GlassCard>
      </ScreenContainer>

      {/* FAB + sheet — overlays rendered outside the ScrollView. */}
      <ExpandableFAB actions={fabActions} />

      {/* Logging sheet */}
      <Sheet ref={sheetRef} snapPoints={['80%']}>
        <Text variant="h3">Log today</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ gap: 12 }}>
            <Field
          bottomSheet
              label="Weight (kg)"
              keyboardType="decimal-pad"
              value={draft.weight}
              onChangeText={(v) => setDraft((d) => ({ ...d, weight: v }))}
            />
            <Field
          bottomSheet
              label="Body Fat (%)"
              keyboardType="decimal-pad"
              value={draft.bodyFat}
              onChangeText={(v) => setDraft((d) => ({ ...d, bodyFat: v }))}
            />
            <Field
          bottomSheet
              label="Water (ml)"
              keyboardType="number-pad"
              value={draft.water}
              onChangeText={(v) => setDraft((d) => ({ ...d, water: v }))}
            />
            <Field
          bottomSheet
              label="Calories (kcal)"
              keyboardType="number-pad"
              value={draft.calories}
              onChangeText={(v) => setDraft((d) => ({ ...d, calories: v }))}
            />
            <Field
          bottomSheet
              label="Sleep (hours)"
              keyboardType="decimal-pad"
              value={draft.sleep}
              onChangeText={(v) => setDraft((d) => ({ ...d, sleep: v }))}
            />
            <Field
          bottomSheet
              label="Steps"
              keyboardType="number-pad"
              value={draft.steps}
              onChangeText={(v) => setDraft((d) => ({ ...d, steps: v }))}
            />
            <Button
              title="Save entry"
              icon={<Plus size={18} color="#fff" />}
              onPress={saveDraft}
            />
          </View>
        </ScrollView>
      </Sheet>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  streakCard: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rings: { gap: 20, paddingVertical: 8, paddingRight: 8 },
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statItem: { width: '47%', flexGrow: 1 },
  chartControls: { gap: 8, marginVertical: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
