import type {
  Achievement,
  BMICategory,
  Goals,
  PremiumFlags,
} from '@/types';
import { palette } from '@/theme/colors';

export const STORAGE_KEYS = {
  profile: 'fitbmi.profile',
  history: 'fitbmi.history',
  health: 'fitbmi.health',
  goals: 'fitbmi.goals',
  settings: 'fitbmi.settings',
  achievements: 'fitbmi.achievements',
  premium: 'fitbmi.premium',
  onboarded: 'fitbmi.onboarded',
} as const;

export const BMI_THRESHOLDS = {
  underweight: 18.5,
  normal: 25,
  overweight: 30,
} as const;

/** Upper bound of the gauge scale used for progress visualisations. */
export const BMI_GAUGE_MAX = 40;

export const CATEGORY_META: Record<
  BMICategory,
  { label: string; color: string; range: string }
> = {
  underweight: {
    label: 'Underweight',
    color: palette.underweight,
    range: '< 18.5',
  },
  normal: { label: 'Normal', color: palette.normal, range: '18.5 – 24.9' },
  overweight: {
    label: 'Overweight',
    color: palette.overweight,
    range: '25 – 29.9',
  },
  obese: { label: 'Obese', color: palette.obese, range: '30+' },
};

export const DEFAULT_GOALS: Goals = {
  waterMlPerDay: 2500,
  sleepHoursPerDay: 8,
  stepsPerDay: 10000,
  caloriesPerDay: 2200,
  targetWeightKg: 70,
};

export const DEFAULT_PREMIUM: PremiumFlags = {
  removeAds: false,
  unlimitedHistory: false,
  unlimitedAiChats: false,
  advancedAnalytics: false,
  advancedReports: false,
  customThemes: false,
  weeklyReports: false,
  exportPdf: false,
};

/** History records allowed on the free tier. */
export const FREE_HISTORY_LIMIT = 20;

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'streak-7',
    title: '7-Day Streak',
    description: 'Logged your health for 7 days in a row.',
    icon: 'flame',
  },
  {
    id: 'streak-30',
    title: '30-Day Streak',
    description: 'A full month of consistent tracking!',
    icon: 'trophy',
  },
  {
    id: 'healthy-bmi',
    title: 'Healthy BMI',
    description: 'Reached the normal BMI range.',
    icon: 'heart-pulse',
  },
  {
    id: 'weight-goal',
    title: 'Weight Goal',
    description: 'Hit your target weight.',
    icon: 'target',
  },
  {
    id: 'water-goal',
    title: 'Hydration Hero',
    description: 'Met your daily water goal.',
    icon: 'droplets',
  },
];

export const DISCLAIMER =
  'This app is intended for general fitness and wellness purposes and does not provide medical advice.';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'ar', label: 'العربية' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'bn', label: 'বাংলা' },
] as const;

// AdMob test unit IDs (safe defaults; replace before production).
export const ADMOB_TEST_IDS = {
  banner: 'ca-app-pub-3940256099942544/6300978111',
  interstitial: 'ca-app-pub-3940256099942544/1033173712',
  rewarded: 'ca-app-pub-3940256099942544/5224354917',
  appOpen: 'ca-app-pub-3940256099942544/9257395921',
} as const;
