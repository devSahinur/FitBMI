import type { ThemeColors } from './colors';
import type { ThemeVariant } from '@/types';

interface VariantDef {
  name: string;
  /** Overrides applied on top of the base light palette. */
  light: Partial<ThemeColors>;
  /** Overrides applied on top of the base dark palette. */
  dark: Partial<ThemeColors>;
}

/**
 * Named theme variants. Each overrides accent + surface colors on top of the
 * base light/dark palettes, so dark mode + variant compose freely.
 */
export const THEME_VARIANTS: Record<ThemeVariant, VariantDef> = {
  glass: {
    name: 'Glassmorphism',
    light: {},
    dark: {},
  },
  neumorphism: {
    name: 'Neumorphism',
    light: {
      background: '#E6EAF0',
      surface: '#E6EAF0',
      surfaceAlt: '#DCE1E9',
      card: 'rgba(230,234,240,0.9)',
      glass: 'rgba(230,234,240,0.8)',
    },
    dark: {
      background: '#1A1F2B',
      surface: '#222838',
      surfaceAlt: '#2A3142',
    },
  },
  amoled: {
    name: 'Dark AMOLED',
    light: {},
    dark: {
      background: '#000000',
      surface: '#000000',
      surfaceAlt: '#0A0A0A',
      card: 'rgba(10,10,10,0.7)',
      glass: 'rgba(10,10,10,0.6)',
      glassBorder: 'rgba(255,255,255,0.06)',
    },
  },
  green: {
    name: 'Green Nature',
    light: {
      background: '#F1F8F2',
      surfaceAlt: '#E3F1E6',
      primary: '#2E9E5B',
      secondary: '#5CC98A',
    },
    dark: {
      background: '#0A140D',
      surface: '#10211608',
      primary: '#39B26A',
      secondary: '#69D89A',
    },
  },
  ocean: {
    name: 'Blue Ocean',
    light: {
      background: '#EFF6FF',
      surfaceAlt: '#DCEBFB',
      primary: '#0EA5E9',
      secondary: '#2563EB',
    },
    dark: {
      background: '#06141F',
      surface: '#0B1F2E',
      primary: '#22B8F0',
      secondary: '#3B82F6',
    },
  },
  purple: {
    name: 'Purple Premium',
    light: {
      background: '#F6F3FF',
      surfaceAlt: '#EAE2FF',
      primary: '#7C5CFC',
      secondary: '#C026D3',
    },
    dark: {
      background: '#0E0A1F',
      surface: '#171231',
      surfaceAlt: '#211A42',
      primary: '#9D7BFF',
      secondary: '#D946EF',
    },
  },
};

export function applyVariant(
  base: ThemeColors,
  variant: ThemeVariant,
  isDark: boolean,
): ThemeColors {
  const def = THEME_VARIANTS[variant];
  return { ...base, ...(isDark ? def.dark : def.light) };
}

export const THEME_VARIANT_LIST = (
  Object.keys(THEME_VARIANTS) as ThemeVariant[]
).map((key) => ({ key, name: THEME_VARIANTS[key].name }));
