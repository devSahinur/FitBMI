import React, { useCallback, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { Flame, Quote } from 'lucide-react-native';

import {
  ScreenContainer,
  SectionHeader,
  AnimatedCard,
  StatCard,
  Text,
  Avatar,
  CategoryPill,
  AnimatedCounter,
} from '@/components';
import { useTheme } from '@/hooks/useTheme';
import { useBMI } from '@/hooks/useBMI';
import { useStreak } from '@/hooks/useStreak';
import { useProfileStore } from '@/store/profile.store';
import { useHealthStore } from '@/store/health.store';
import { useSettingsStore } from '@/store/settings.store';
import { greetingForHour, toDateKey } from '@/utils/date';
import { formatWeight } from '@/utils/format';
import { quoteOfTheDay } from '@/constants/quotes';
import { DailyInsights } from '@/components/ai/DailyInsights';

export function HomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { profile, goals } = useProfileStore();
  const unit = useSettingsStore((s) => s.unit);
  const today = useHealthStore((s) => s.entries[toDateKey()]);
  const streak = useStreak();

  const { bmi, category } = useBMI(profile.currentWeightKg, profile.heightCm);
  const quote = useMemo(() => quoteOfTheDay(), []);

  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['ai', 'insights'] });
    setTimeout(() => setRefreshing(false), 600);
  }, [queryClient]);

  const summary = [
    {
      label: 'Weight',
      value: profile.currentWeightKg,
      unit: unit === 'imperial' ? 'lb' : 'kg',
      icon: 'Scale' as const,
      decimals: 1,
    },
    { label: 'BMI', value: bmi, icon: 'HeartPulse' as const, decimals: 1 },
    {
      label: 'Target',
      value: profile.targetWeightKg,
      unit: unit === 'imperial' ? 'lb' : 'kg',
      icon: 'Target' as const,
      decimals: 1,
    },
    {
      label: 'Calories',
      value: today?.calories ?? 0,
      unit: 'kcal',
      icon: 'Flame' as const,
    },
    {
      label: 'Water',
      value: today?.waterMl ?? 0,
      unit: 'ml',
      icon: 'Droplets' as const,
    },
    {
      label: 'Sleep',
      value: today?.sleepHours ?? 0,
      unit: 'h',
      icon: 'Moon' as const,
      decimals: 1,
    },
    {
      label: 'Steps',
      value: today?.steps ?? 0,
      icon: 'Footprints' as const,
    },
  ];

  return (
    <ScreenContainer refreshing={refreshing} onRefresh={onRefresh}>
      {/* Header */}
      <MotiView
        from={{ opacity: 0, translateY: -12 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 400 }}
        style={styles.header}
      >
        <View style={{ flex: 1 }}>
          <Text variant="caption" tone="muted">
            {greetingForHour()},
          </Text>
          <Text variant="h2">{profile.name} 👋</Text>
        </View>
        <Avatar uri={profile.avatarUri} name={profile.name} size={52} />
      </MotiView>

      {/* Hero BMI card */}
      <AnimatedCard index={0} style={styles.hero}>
        <View style={styles.heroRow}>
          <View>
            <Text variant="label" tone="muted">
              Your BMI today
            </Text>
            <AnimatedCounter value={bmi} decimals={1} variant="h1" />
            <CategoryPill category={category} />
          </View>
          <View style={[styles.streak, { backgroundColor: `${colors.primary}1A` }]}>
            <Flame size={20} color={colors.primary} />
            <Text variant="title" tone="primary">
              {streak}
            </Text>
            <Text variant="caption" tone="muted">
              day streak
            </Text>
          </View>
        </View>
      </AnimatedCard>

      <SectionHeader title="Today's summary" />
      <View style={styles.grid}>
        {summary.map((s, i) => (
          <View key={s.label} style={styles.gridItem}>
            <StatCard
              label={s.label}
              value={s.value}
              unit={s.unit}
              decimals={s.decimals ?? 0}
              icon={s.icon}
              index={i}
            />
          </View>
        ))}
      </View>

      {/* AI daily insights */}
      <DailyInsights />

      {/* Goals snapshot */}
      <AnimatedCard index={2}>
        <SectionHeader
          title="Goals"
          action={{ label: 'Track', onPress: () => router.push('/tracker') }}
        />
        <View style={{ gap: 6, marginTop: 8 }}>
          <Text variant="caption" tone="muted">
            Target weight {formatWeight(goals.targetWeightKg, unit)} · Water{' '}
            {goals.waterMlPerDay} ml · Sleep {goals.sleepHoursPerDay}h
          </Text>
        </View>
      </AnimatedCard>

      {/* Motivational quote */}
      <AnimatedCard index={3} style={{ gap: 8 }}>
        <Quote size={22} color={colors.primary} />
        <Text variant="title" style={{ fontStyle: 'italic' }}>
          “{quote.text}”
        </Text>
        <Text variant="caption" tone="muted">
          — {quote.author}
        </Text>
      </AnimatedCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  hero: { gap: 4 },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  streak: {
    alignItems: 'center',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: { width: '47%', flexGrow: 1 },
});
