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
import { getWorkout } from '@/services/ai.service';
import type { WorkoutType } from '@/features/ai/types';

const TYPES: { label: string; value: WorkoutType }[] = [
  { label: 'Home', value: 'home' },
  { label: 'Beginner', value: 'beginner' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Advanced', value: 'advanced' },
  { label: 'No Equipment', value: 'no-equipment' },
  { label: 'Weight Loss', value: 'weight-loss' },
  { label: 'Muscle Gain', value: 'muscle-gain' },
];

export function WorkoutScreen() {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const ctx = useAIContext();
  const [type, setType] = useState<WorkoutType>('home');
  const bg = isDark
    ? (['#0B0F1A', '#0E1626'] as const)
    : (['#F4F6FA', '#EAF0FA'] as const);

  return (
    <LinearGradient colors={bg} style={{ flex: 1 }}>
      <ModalHeader title="AI Workout Generator" />
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: insets.bottom + 32,
          gap: 12,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="body" tone="muted">
          Get a routine with sets, reps, rest times and estimated calories
          burned, tailored to your level.
        </Text>
        <AIToolView
          title="Workout"
          queryKey={['ai', 'workout', type, ctx.bmiCategory]}
          run={(signal) => getWorkout(ctx, type, signal)}
          generateLabel="Generate workout"
          xpReward={15}
          controls={
            <View style={styles.chips}>
              {TYPES.map((t) => (
                <Chip
                  key={t.value}
                  label={t.label}
                  active={type === t.value}
                  onPress={() => setType(t.value)}
                />
              ))}
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
