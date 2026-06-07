import {
  chatCompletion,
  hasApiKey,
  type ChatMessage,
} from './openrouter.service';
import {
  systemPrompt,
  insightsPrompt,
  mealPlanPrompt,
  weeklyReportPrompt,
  goalPlanPrompt,
  workoutPrompt,
  recipePrompt,
} from '@/features/ai/prompts';
import type {
  AIInsight,
  AIUserContext,
  GoalType,
  PlanDuration,
  WorkoutType,
} from '@/features/ai/types';
import { uid } from '@/utils/id';

export { hasApiKey };

async function ask(
  ctx: AIUserContext,
  userPrompt: string,
  signal?: AbortSignal,
): Promise<string> {
  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt(ctx) },
    { role: 'user', content: userPrompt },
  ];
  const { text } = await chatCompletion(messages, { signal });
  return text.trim();
}

/** Strip ```json fences a model might wrap JSON in. */
function stripFences(raw: string): string {
  return raw
    .replace(/^```(?:json)?/i, '')
    .replace(/```$/, '')
    .trim();
}

export async function getDailyInsights(
  ctx: AIUserContext,
  signal?: AbortSignal,
): Promise<AIInsight[]> {
  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt(ctx) },
    { role: 'user', content: insightsPrompt(ctx) },
  ];
  const { text } = await chatCompletion(messages, { temperature: 0.8, signal });
  try {
    const parsed = JSON.parse(stripFences(text)) as Omit<AIInsight, 'id'>[];
    return parsed.slice(0, 4).map((p) => ({ ...p, id: uid('insight') }));
  } catch {
    // Fallback to a single insight wrapping the raw text.
    return [
      {
        id: uid('insight'),
        type: 'tip',
        emoji: '💡',
        title: 'Tip of the day',
        body: text.slice(0, 140),
      },
    ];
  }
}

export const getMealPlan = (ctx: AIUserContext, signal?: AbortSignal) =>
  ask(ctx, mealPlanPrompt(ctx), signal);

export const getWeeklyReport = (
  ctx: AIUserContext,
  stats: Parameters<typeof weeklyReportPrompt>[1],
  signal?: AbortSignal,
) => ask(ctx, weeklyReportPrompt(ctx, stats), signal);

export const getGoalPlan = (
  ctx: AIUserContext,
  goal: GoalType,
  days: PlanDuration,
  signal?: AbortSignal,
) => ask(ctx, goalPlanPrompt(ctx, goal, days), signal);

export const getWorkout = (
  ctx: AIUserContext,
  type: WorkoutType,
  signal?: AbortSignal,
) => ask(ctx, workoutPrompt(ctx, type), signal);

export const getRecipe = (
  ctx: AIUserContext,
  request: string,
  signal?: AbortSignal,
) => ask(ctx, recipePrompt(ctx, request), signal);
