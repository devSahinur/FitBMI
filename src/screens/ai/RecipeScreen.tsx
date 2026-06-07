import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { ModalHeader } from '@/components/layout/ModalHeader';
import { AIToolView } from '@/components/ai/AIToolView';
import { Field } from '@/components/ui/Field';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/useTheme';
import { useAIContext } from '@/hooks/useAIContext';
import { getRecipe } from '@/services/ai.service';

export function RecipeScreen() {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const ctx = useAIContext();
  const [request, setRequest] = useState('');
  const bg = isDark
    ? (['#0B0F1A', '#0E1626'] as const)
    : (['#F4F6FA', '#EAF0FA'] as const);

  return (
    <LinearGradient colors={bg} style={{ flex: 1 }}>
      <ModalHeader title="AI Recipe Generator" />
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: insets.bottom + 32,
          gap: 12,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text variant="body" tone="muted">
          Healthy recipes with ingredients, instructions, calories, protein,
          fat, carbs and prep time.
        </Text>
        <AIToolView
          title="Recipe"
          queryKey={['ai', 'recipe', request.trim().toLowerCase(), ctx.bmiCategory]}
          run={(signal) => getRecipe(ctx, request.trim(), signal)}
          generateLabel="Generate recipe"
          xpReward={12}
          controls={
            <Field
              label="What would you like? (optional)"
              placeholder="e.g. high-protein vegetarian dinner"
              value={request}
              onChangeText={setRequest}
            />
          }
        />
      </ScrollView>
    </LinearGradient>
  );
}
