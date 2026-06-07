import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { icons } from 'lucide-react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { GlassCard } from '@/components/ui/GlassCard';
import { Text } from '@/components/ui/Text';
import { useHaptics } from '@/hooks/useHaptics';
import { palette } from '@/theme';
import { hasApiKey } from '@/services/openrouter.service';
import { HEALTH_DISCLAIMER } from '@/features/ai/prompts';

interface Tool {
  title: string;
  subtitle: string;
  icon: keyof typeof icons;
  href: Href;
  colors: readonly [string, string];
  soon?: boolean;
}

const TOOLS: Tool[] = [
  {
    title: 'AI Health Coach',
    subtitle: 'Chat for advice',
    icon: 'MessagesSquare',
    href: '/ai/coach',
    colors: [palette.primary, palette.secondary],
  },
  {
    title: 'Meal Plan',
    subtitle: 'Smart suggestions',
    icon: 'Salad',
    href: '/ai/meal',
    colors: ['#00C897', '#00A87E'],
  },
  {
    title: 'Workout',
    subtitle: 'Sets, reps, calories',
    icon: 'Dumbbell',
    href: '/ai/workout',
    colors: ['#00A8FF', '#0088CC'],
  },
  {
    title: 'Recipes',
    subtitle: 'Healthy & macro-rich',
    icon: 'ChefHat',
    href: '/ai/recipe',
    colors: ['#FFB020', '#F59E0B'],
  },
  {
    title: 'Goal Planner',
    subtitle: '7 / 30 / 90 days',
    icon: 'Target',
    href: '/ai/goals',
    colors: ['#9D7BFF', '#7C5CFC'],
  },
  {
    title: 'Weekly Report',
    subtitle: 'Trends & tips',
    icon: 'FileText',
    href: '/ai/report',
    colors: ['#FF5C8A', '#E11D74'],
  },
  {
    title: 'Food Scanner',
    subtitle: 'Coming soon',
    icon: 'ScanLine',
    href: '/ai',
    colors: ['#64748B', '#475569'],
    soon: true,
  },
];

export function AIHubScreen() {
  const router = useRouter();
  const haptic = useHaptics();

  return (
    <ScreenContainer>
      <SectionHeader title="AI Studio" />
      {!hasApiKey() && (
        <GlassCard>
          <Text variant="title">🔑 Connect AI</Text>
          <Text variant="caption" tone="muted">
            Add EXPO_PUBLIC_OPENROUTER_API_KEY to your .env to unlock AI features
            (with model fallback across Claude, DeepSeek, Qwen & GPT).
          </Text>
        </GlassCard>
      )}

      <View style={styles.grid}>
        {TOOLS.map((t, i) => {
          const Icon = icons[t.icon] ?? icons.Sparkles;
          return (
            <MotiView
              key={t.title}
              from={{ opacity: 0, scale: 0.95, translateY: 12 }}
              animate={{ opacity: 1, scale: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 350, delay: i * 60 }}
              style={styles.cell}
            >
              <Pressable
                accessibilityRole="button"
                disabled={t.soon}
                onPress={() => {
                  haptic('light');
                  router.push(t.href);
                }}
                style={{ opacity: t.soon ? 0.55 : 1 }}
              >
                <GlassCard style={styles.card}>
                  <LinearGradient colors={t.colors} style={styles.iconWrap}>
                    <Icon size={22} color="#fff" />
                  </LinearGradient>
                  <Text variant="title" numberOfLines={1}>
                    {t.title}
                  </Text>
                  <Text variant="caption" tone="muted" numberOfLines={1}>
                    {t.subtitle}
                  </Text>
                </GlassCard>
              </Pressable>
            </MotiView>
          );
        })}
      </View>

      <Text variant="label" tone="muted" style={styles.disclaimer}>
        {HEALTH_DISCLAIMER}
      </Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  cell: { width: '47%', flexGrow: 1 },
  card: { minHeight: 130, justifyContent: 'space-between', gap: 6 },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disclaimer: { textAlign: 'center', marginTop: 8 },
});
