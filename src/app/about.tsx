import { LegalScreen } from '@/screens/LegalScreen';
import { DISCLAIMER } from '@/constants';

export default function About() {
  return (
    <LegalScreen
      title="About FitBMI"
      updated="v1.0.0"
      footer={DISCLAIMER}
      sections={[
        {
          heading: 'FitBMI',
          body: 'A modern, privacy-first BMI calculator and health tracker. Track your weight, BMI, water, sleep, calories and steps — all stored securely on your device.',
        },
        {
          heading: 'Features',
          body: '• Accurate BMI with animated gauge\n• Daily health tracking & streaks\n• Weekly & monthly trend charts\n• Achievements & goals\n• Local reminders\n• CSV / report export\n• Light & dark glassmorphism design',
        },
        {
          heading: 'Built With',
          body: 'React Native, Expo, TypeScript, Expo Router, NativeWind, Reanimated, Moti, Zustand, React Query, MMKV, Victory Native XL and Skia.',
        },
        {
          heading: 'Credits',
          body: 'Icons by Lucide. Illustrations from unDraw. Animations from LottieFiles. Fonts from Google Fonts. All assets used under free commercial licenses.',
        },
      ]}
    />
  );
}
