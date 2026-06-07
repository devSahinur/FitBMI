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
          body: 'A modern, privacy-first BMI calculator and health tracker with an AI health coach. Track your weight, BMI, water, sleep, calories and steps — all stored securely on your device.',
        },
        {
          heading: 'Features',
          body: '• Accurate BMI with an animated gauge\n• AI Health Coach + meal, workout, recipe, goal & weekly-report generators\n• Daily AI insights\n• Live step tracking (device pedometer)\n• Water, sleep, calorie & weight tracking with charts\n• Streaks, XP, levels, coins & achievements\n• Local reminders & CSV / report export\n• Light, Dark & AMOLED with 6 theme styles\n• 7 languages',
        },
        {
          heading: 'AI & Privacy',
          body: 'AI features are powered by OpenRouter using free and low-cost models, with automatic fallback. Your data stays on your device; only the text you send to the coach (plus basic profile context) is processed by the AI provider when you use those features. See the Privacy Policy for details.',
        },
        {
          heading: 'Built With',
          body: 'React Native, Expo (SDK 54), TypeScript, Expo Router, NativeWind, Reanimated, Moti, Zustand, React Query, AsyncStorage, react-native-svg, i18next and expo-sensors.',
        },
        {
          heading: 'Credits',
          body: 'Icons by Lucide. Fonts (Poppins & Inter) from Google Fonts. All assets are used under free commercial licenses.',
        },
      ]}
    />
  );
}
