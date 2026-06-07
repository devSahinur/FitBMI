import React, { useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { ModalHeader } from '@/components/layout/ModalHeader';
import { AIToolView } from '@/components/ai/AIToolView';
import { Chip } from '@/components/ui/Chip';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/useTheme';
import { useAIContext } from '@/hooks/useAIContext';
import { getGoalPlan } from '@/services/ai.service';
import type { GoalType, PlanDuration } from '@/features/ai/types';

const GOALS: { label: string; value: GoalType }[] = [
  { label: 'Lose Weight', value: 'lose-weight' },
  { label: 'Gain Weight', value: 'gain-weight' },
  { label: 'Maintain', value: 'maintain-weight' },
  { label: 'Improve Sleep', value: 'improve-sleep' },
  { label: 'More Water', value: 'increase-water' },
];

const DURATIONS: PlanDuration[] = [7, 30, 90];

export function GoalPlannerScreen() {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const ctx = useAIContext();
  const [goal, setGoal] = useState<GoalType>('lose-weight');
  const [days, setDays] = useState<PlanDuration>(7);
  const bg = isDark
    ? (['#0B0F1A', '#0E1626'] as const)
    : (['#F4F6FA', '#EAF0FA'] as const);

  return (
    <LinearGradient colors={bg} style={{ flex: 1 }}>
      <ModalHeader title="AI Goal Planner" />
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: insets.bottom + 32,
          gap: 12,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="body" tone="muted">
          A structured plan with nutrition, activity, hydration and sleep
          guidance plus weekly milestones.
        </Text>
        <AIToolView
          title="Goal plan"
          queryKey={['ai', 'goal', goal, days, ctx.bmiCategory]}
          run={(signal) => getGoalPlan(ctx, goal, days, signal)}
          generateLabel="Generate plan"
          xpReward={20}
          controls={
            <View style={{ gap: 10 }}>
              <Text variant="label" tone="muted">
                Goal
              </Text>
              <View style={styles.chips}>
                {GOALS.map((g) => (
                  <Chip
                    key={g.value}
                    label={g.label}
                    active={goal === g.value}
                    onPress={() => setGoal(g.value)}
                  />
                ))}
              </View>
              <Text variant="label" tone="muted">
                Duration
              </Text>
              <View style={styles.chips}>
                {DURATIONS.map((d) => (
                  <Chip
                    key={d}
                    label={`${d} days`}
                    active={days === d}
                    onPress={() => setDays(d)}
                  />
                ))}
              </View>
            </View>
          }
        />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
