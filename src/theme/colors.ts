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
  accent: '#FFB800',
  success: '#00D26A',
  warning: '#FF9F1C',
  error: '#FF4D4F',
  dark: '#111827',
  background: '#F7F8FA',
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
  accent: string;
  success: string;
  warning: string;
  error: string;
  shadow: string;
}

export const lightColors: ThemeColors = {
  background: '#F4F6FA',
  surface: '#FFFFFF',
  surfaceAlt: '#EDF1F7',
  // More opaque cards so content reads cleanly over the light background,
  // with a hairline border for definition (the "soft UI" card look).
  card: 'rgba(255,255,255,0.92)',
  glass: 'rgba(255,255,255,0.78)',
  glassBorder: 'rgba(17,24,39,0.07)',
  text: '#0F172A',
  textMuted: '#64748B',
  textInverse: '#FFFFFF',
  border: 'rgba(15,23,42,0.10)',
  primary: palette.primary,
  secondary: palette.secondary,
  accent: palette.accent,
  success: palette.success,
  warning: palette.warning,
  error: palette.error,
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
  accent: palette.accent,
  success: palette.success,
  warning: palette.warning,
  error: palette.error,
  shadow: '#000000',
};
