import type { BMICategory, Gender } from '@/types';

/** Common user context injected into AI prompts. */
export interface AIUserContext {
  name: string;
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
  bmi: number;
  bmiCategory: BMICategory;
  unit: 'metric' | 'imperial';
}

export interface AIInsight {
  id: string;
  type: 'motivation' | 'tip' | 'fact' | 'summary';
  emoji: string;
  title: string;
  body: string;
}

export type GoalType =
  | 'lose-weight'
  | 'gain-weight'
  | 'maintain-weight'
  | 'improve-sleep'
  | 'increase-water';

export type PlanDuration = 7 | 30 | 90;

export type WorkoutType =
  | 'home'
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'no-equipment'
  | 'weight-loss'
  | 'muscle-gain';

export interface ChatThreadMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: number;
  model?: string;
  /** True while the assistant message is still streaming. */
  streaming?: boolean;
}
