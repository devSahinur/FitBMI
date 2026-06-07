import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AppSettings, ThemeMode, UnitSystem } from '@/types';
import { STORAGE_KEYS } from '@/constants';
import { zustandStorage } from '@/services/storage.service';

interface SettingsState extends AppSettings {
  setUnit: (unit: UnitSystem) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setLanguage: (language: string) => void;
  toggleHaptics: () => void;
  setNotification: (
    key: keyof AppSettings['notifications'],
    value: boolean,
  ) => void;
  reset: () => void;
}

const defaults: AppSettings = {
  unit: 'metric',
  themeMode: 'system',
  language: 'en',
  haptics: true,
  notifications: {
    enabled: true,
    drinkWater: true,
    measureWeight: true,
    sleepReminder: false,
    morningMotivation: true,
  },
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaults,
      setUnit: (unit) => set({ unit }),
      setThemeMode: (themeMode) => set({ themeMode }),
      setLanguage: (language) => set({ language }),
      toggleHaptics: () => set((s) => ({ haptics: !s.haptics })),
      setNotification: (key, value) =>
        set((s) => ({
          notifications: { ...s.notifications, [key]: value },
        })),
      reset: () => set(defaults),
    }),
    {
      name: STORAGE_KEYS.settings,
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
