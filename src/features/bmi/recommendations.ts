import type { BMICategory } from '@/types';

export interface Recommendation {
  icon: string; // lucide name
  title: string;
  body: string;
}

const RECOMMENDATIONS: Record<BMICategory, Recommendation[]> = {
  underweight: [
    {
      icon: 'utensils',
      title: 'Nutrient-dense meals',
      body: 'Add healthy calories: nuts, dairy, whole grains and lean protein.',
    },
    {
      icon: 'dumbbell',
      title: 'Strength training',
      body: 'Build muscle mass with resistance exercises 3–4× per week.',
    },
    {
      icon: 'stethoscope',
      title: 'Check in',
      body: 'Persistent low weight? Consider speaking with a professional.',
    },
  ],
  normal: [
    {
      icon: 'check-circle',
      title: 'Great job!',
      body: 'You’re in the healthy range. Maintain your balanced routine.',
    },
    {
      icon: 'salad',
      title: 'Balanced diet',
      body: 'Keep eating varied whole foods and stay hydrated.',
    },
    {
      icon: 'activity',
      title: 'Stay active',
      body: 'Aim for 150 minutes of moderate activity weekly.',
    },
  ],
  overweight: [
    {
      icon: 'footprints',
      title: 'Move more',
      body: 'Add daily walks and gradually increase your step count.',
    },
    {
      icon: 'salad',
      title: 'Mindful eating',
      body: 'Reduce processed sugar and watch portion sizes.',
    },
    {
      icon: 'droplets',
      title: 'Hydrate',
      body: 'Drinking water before meals can help manage appetite.',
    },
  ],
  obese: [
    {
      icon: 'heart-pulse',
      title: 'Small steps',
      body: 'Start with achievable goals — consistency beats intensity.',
    },
    {
      icon: 'stethoscope',
      title: 'Seek guidance',
      body: 'A healthcare professional can build a safe plan with you.',
    },
    {
      icon: 'moon',
      title: 'Prioritise sleep',
      body: 'Quality sleep supports metabolism and healthy choices.',
    },
  ],
};

export function getRecommendations(category: BMICategory): Recommendation[] {
  return RECOMMENDATIONS[category];
}
