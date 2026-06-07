import { CATEGORY_META } from '@/constants';
import type {
  AIUserContext,
  GoalType,
  PlanDuration,
  WorkoutType,
} from './types';

export const HEALTH_DISCLAIMER =
  'AI responses are informational only and not medical advice.';

const GOAL_LABELS: Record<GoalType, string> = {
  'lose-weight': 'lose weight',
  'gain-weight': 'gain weight',
  'maintain-weight': 'maintain weight',
  'improve-sleep': 'improve sleep',
  'increase-water': 'increase water intake',
};

const WORKOUT_LABELS: Record<WorkoutType, string> = {
  home: 'home workout',
  beginner: 'beginner workout',
  intermediate: 'intermediate workout',
  advanced: 'advanced workout',
  'no-equipment': 'no-equipment workout',
  'weight-loss': 'weight-loss workout',
  'muscle-gain': 'muscle-gain workout',
};

/** A compact, factual summary of the user for grounding prompts. */
export function contextLine(ctx: AIUserContext): string {
  return [
    `Name: ${ctx.name}`,
    `Age: ${ctx.age}`,
    `Gender: ${ctx.gender}`,
    `Height: ${ctx.heightCm} cm`,
    `Weight: ${ctx.weightKg} kg`,
    `Target weight: ${ctx.targetWeightKg} kg`,
    `BMI: ${ctx.bmi} (${CATEGORY_META[ctx.bmiCategory].label})`,
  ].join(', ');
}

/** System prompt shared by all AI features. */
export function systemPrompt(ctx: AIUserContext): string {
  return [
    'You are FitBMI Coach, a friendly, encouraging health and fitness assistant.',
    'Give concise, practical, evidence-based guidance. Use simple language.',
    'Format answers in clean markdown with short paragraphs, headings and bullet lists where helpful.',
    `Always end health advice with a brief reminder: "${HEALTH_DISCLAIMER}"`,
    `User profile — ${contextLine(ctx)}.`,
    'Tailor everything to this profile. Never give a medical diagnosis.',
  ].join(' ');
}

export function coachSystemPrompt(ctx: AIUserContext): string {
  return (
    systemPrompt(ctx) +
    ' You can help with healthy weight recommendations, daily fitness advice, ' +
    'water intake, sleep, calories and BMI explanations.'
  );
}

export function insightsPrompt(ctx: AIUserContext): string {
  return [
    `Based on this profile: ${contextLine(ctx)}.`,
    'Generate exactly 4 short daily health insights as a JSON array.',
    'Each item: { "type": one of "motivation"|"tip"|"fact"|"summary", "emoji": single emoji, "title": max 5 words, "body": max 25 words }.',
    'Order: one motivation, one tip, one fact, one summary.',
    'Return ONLY the JSON array, no markdown fences, no extra text.',
  ].join(' ');
}

export function mealPlanPrompt(ctx: AIUserContext): string {
  return [
    `Create a one-day healthy meal plan for: ${contextLine(ctx)}.`,
    'Include Breakfast, Lunch, Dinner and Snacks.',
    'For each meal give the dish, approximate calories and protein (g).',
    'At the end include a "Daily Targets" section with total calories, protein goal (g) and water goal (ml/L).',
    'Format as clean markdown with headings and bullets.',
  ].join(' ');
}

export function weeklyReportPrompt(
  ctx: AIUserContext,
  stats: {
    weightChangeKg: number;
    bmiNow: number;
    avgSleep: number;
    avgWaterMl: number;
    avgSteps: number;
    daysLogged: number;
    achievements: string[];
  },
): string {
  return [
    `Write a motivating weekly health report for: ${contextLine(ctx)}.`,
    `This week's data — weight change: ${stats.weightChangeKg} kg, current BMI: ${stats.bmiNow}, ` +
      `avg sleep: ${stats.avgSleep} h, avg water: ${stats.avgWaterMl} ml, avg steps: ${stats.avgSteps}, ` +
      `days logged: ${stats.daysLogged}, achievements: ${stats.achievements.join(', ') || 'none'}.`,
    'Sections: ## Summary, ## Weight & BMI, ## Habits (sleep/water/steps), ## Achievements, ## Suggestions for next week.',
    'Be specific and encouraging. Format as clean markdown.',
  ].join(' ');
}

export function goalPlanPrompt(
  ctx: AIUserContext,
  goal: GoalType,
  days: PlanDuration,
): string {
  return [
    `Create a ${days}-day plan to ${GOAL_LABELS[goal]} for: ${contextLine(ctx)}.`,
    days <= 7
      ? 'Provide a day-by-day breakdown.'
      : 'Break it into weekly phases with key daily habits.',
    'Include nutrition, activity, hydration and sleep guidance, plus a realistic weekly milestone.',
    'Format as clean markdown with headings and checklists.',
  ].join(' ');
}

export function workoutPrompt(ctx: AIUserContext, type: WorkoutType): string {
  return [
    `Generate a ${WORKOUT_LABELS[type]} routine for: ${contextLine(ctx)}.`,
    'List 5-7 exercises. For each give: name, sets, reps, rest time, and estimated calories burned.',
    'Add a short warm-up and cool-down, and total estimated calories burned and duration.',
    'Format as clean markdown with a table or bullet list.',
  ].join(' ');
}

export function recipePrompt(ctx: AIUserContext, request: string): string {
  return [
    `Generate a healthy recipe${request ? ` for: "${request}"` : ''}.`,
    `Tailor it to: ${contextLine(ctx)}.`,
    'Include: Ingredients, Step-by-step Instructions, and a Nutrition section with calories, protein (g), fat (g), carbohydrates (g) and preparation time.',
    'Format as clean markdown.',
  ].join(' ');
}
