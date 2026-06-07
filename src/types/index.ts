/** Global type definitions for FitBMI. */

export type UnitSystem = 'metric' | 'imperial';
export type Gender = 'male' | 'female' | 'other';
export type ThemeMode = 'light' | 'dark' | 'system';
export type ThemeVariant =
  | 'glass'
  | 'neumorphism'
  | 'amoled'
  | 'green'
  | 'ocean'
  | 'purple';

export type BMICategory =
  | 'underweight'
  | 'normal'
  | 'overweight'
  | 'obese';

export interface BMIResult {
  /** Body Mass Index, rounded to one decimal. */
  bmi: number;
  category: BMICategory;
  /** Healthy weight range [minKg, maxKg] for the given height. */
  healthyRange: [number, number];
  /** How far into the 0–40 gauge scale, clamped 0..1. */
  gaugeProgress: number;
}

export interface BMIRecord {
  id: string;
  bmi: number;
  category: BMICategory;
  weightKg: number;
  heightCm: number;
  age: number;
  gender: Gender;
  unit: UnitSystem;
  createdAt: number; // epoch ms
  note?: string;
}

export interface Profile {
  name: string;
  avatarUri?: string;
  gender: Gender;
  age: number;
  heightCm: number;
  currentWeightKg: number;
  targetWeightKg: number;
}

export interface HealthEntry {
  id: string;
  date: string; // ISO yyyy-mm-dd
  weightKg?: number;
  bodyFatPct?: number;
  waterMl?: number;
  calories?: number;
  sleepHours?: number;
  steps?: number;
}

export interface Goals {
  waterMlPerDay: number;
  sleepHoursPerDay: number;
  stepsPerDay: number;
  caloriesPerDay: number;
  targetWeightKg: number;
}

export interface AppSettings {
  unit: UnitSystem;
  themeMode: ThemeMode;
  themeVariant: ThemeVariant;
  language: string;
  haptics: boolean;
  notifications: {
    enabled: boolean;
    drinkWater: boolean;
    measureWeight: boolean;
    sleepReminder: boolean;
    morningMotivation: boolean;
  };
}

export type AchievementId =
  | 'streak-7'
  | 'streak-30'
  | 'healthy-bmi'
  | 'weight-goal'
  | 'water-goal';

export interface Achievement {
  id: AchievementId;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}

export interface PremiumFlags {
  removeAds: boolean;
  unlimitedHistory: boolean;
  unlimitedAiChats: boolean;
  advancedAnalytics: boolean;
  advancedReports: boolean;
  customThemes: boolean;
  weeklyReports: boolean;
  exportPdf: boolean;
}

export interface ChartPoint {
  x: number; // timestamp or index
  y: number;
  label?: string;
}
