import { useColorScheme } from 'react-native';
import { useMemo } from 'react';
import { lightTheme, darkTheme, type Theme } from '@/theme';
import { applyVariant } from '@/theme/variants';
import { useSettingsStore } from '@/store/settings.store';

/**
 * Resolves the active theme from the user's preference (light/dark/system),
 * the OS color scheme, and the selected theme variant.
 */
export function useTheme(): Theme & { isDark: boolean } {
  const systemScheme = useColorScheme();
  const mode = useSettingsStore((s) => s.themeMode);
  const variant = useSettingsStore((s) => s.themeVariant);

  return useMemo(() => {
    const isDark =
      mode === 'dark' || (mode === 'system' && systemScheme === 'dark');
    const base = isDark ? darkTheme : lightTheme;
    return {
      ...base,
      colors: applyVariant(base.colors, variant, isDark),
      isDark,
    };
  }, [mode, systemScheme, variant]);
}
