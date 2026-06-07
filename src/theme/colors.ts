/**
 * Central color palette for FitBMI.
 * These mirror the tokens declared in tailwind.config.js so that
 * imperative (non-className) usages — charts, SVG, gradients — stay in sync.
 */
export const palette = {
  primary: '#00C897',
  primaryLight: '#33D4AC',
  primaryDark: '#00A87E',
  secondary: '#00A8FF',
  secondaryLight: '#33BAFF',
  secondaryDark: '#0088CC',
  dark: '#111827',
  background: '#F5F7FA',
  white: '#FFFFFF',
  black: '#000000',
  // BMI classification
  underweight: '#00A8FF',
  normal: '#00C897',
  overweight: '#FFB020',
  obese: '#FF5C5C',
} as const;

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceAlt: string;
  card: string;
  glass: string;
  glassBorder: string;
  text: string;
  textMuted: string;
  textInverse: string;
  border: string;
  primary: string;
  secondary: string;
  shadow: string;
}

export const lightColors: ThemeColors = {
  background: '#F5F7FA',
  surface: '#FFFFFF',
  surfaceAlt: '#EEF2F7',
  card: 'rgba(255,255,255,0.75)',
  glass: 'rgba(255,255,255,0.55)',
  glassBorder: 'rgba(255,255,255,0.6)',
  text: '#111827',
  textMuted: '#6B7280',
  textInverse: '#FFFFFF',
  border: 'rgba(17,24,39,0.08)',
  primary: palette.primary,
  secondary: palette.secondary,
  shadow: '#1F2937',
};

export const darkColors: ThemeColors = {
  background: '#0B0F1A',
  surface: '#111827',
  surfaceAlt: '#1B2436',
  card: 'rgba(31,41,55,0.65)',
  glass: 'rgba(31,41,55,0.55)',
  glassBorder: 'rgba(255,255,255,0.08)',
  text: '#F9FAFB',
  textMuted: '#9CA3AF',
  textInverse: '#0B0F1A',
  border: 'rgba(255,255,255,0.08)',
  primary: palette.primary,
  secondary: palette.secondary,
  shadow: '#000000',
};
