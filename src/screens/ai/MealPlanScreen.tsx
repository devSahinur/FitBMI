import React from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { ModalHeader } from '@/components/layout/ModalHeader';
import { AIToolView } from '@/components/ai/AIToolView';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/useTheme';
import { useAIContext } from '@/hooks/useAIContext';
import { getMealPlan } from '@/services/ai.service';

export function MealPlanScreen() {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const ctx = useAIContext();
  const bg = isDark
    ? (['#0B0F1A', '#0E1626'] as const)
    : (['#F4F6FA', '#EAF0FA'] as const);

  return (
    <LinearGradient colors={bg} style={{ flex: 1 }}>
      <ModalHeader title="Smart Meal Plan" />
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: insets.bottom + 32,
          gap: 12,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text variant="body" tone="muted">
            A personalised one-day plan with breakfast, lunch, dinner, snacks,
            calories, protein and water goals — based on your profile.
          </Text>
        </View>
        <AIToolView
          title="Meal plan"
          queryKey={['ai', 'meal', ctx.weightKg, ctx.bmiCategory, ctx.age]}
          run={(signal) => getMealPlan(ctx, signal)}
          generateLabel="Generate meal plan"
          xpReward={15}
        />
      </ScrollView>
    </LinearGradient>
  );
}
