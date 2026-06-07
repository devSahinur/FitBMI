import { useColorScheme } from 'react-native';
import { useMemo } from 'react';
import { lightTheme, darkTheme, type Theme } from '@/theme';
import { useSettingsStore } from '@/store/settings.store';

/**
 * Resolves the active theme from the user's preference (light/dark/system)
 * and the OS color scheme.
 */
export function useTheme(): Theme & { isDark: boolean } {
  const systemScheme = useColorScheme();
  const mode = useSettingsStore((s) => s.themeMode);

  return useMemo(() => {
    const isDark =
      mode === 'dark' || (mode === 'system' && systemScheme === 'dark');
    const theme = isDark ? darkTheme : lightTheme;
    return { ...theme, isDark };
  }, [mode, systemScheme]);
}
