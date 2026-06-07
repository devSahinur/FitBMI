import { useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { useSettingsStore } from '@/store/settings.store';

type HapticKind = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

/** Haptics that respect the user's haptics setting. */
export function useHaptics() {
  const enabled = useSettingsStore((s) => s.haptics);

  return useCallback(
    (kind: HapticKind = 'light') => {
      if (!enabled) return;
      switch (kind) {
        case 'success':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case 'warning':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        case 'error':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
        case 'medium':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'heavy':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        default:
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    },
    [enabled],
  );
}
