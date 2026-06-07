import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/constants';
import { zustandStorage } from '@/services/storage.service';

interface AppState {
  onboarded: boolean;
  /** True once persisted state has finished loading from storage. */
  hasHydrated: boolean;
  setHydrated: (v: boolean) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

/** App-level flags (onboarding completion, hydration status). */
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      onboarded: false,
      hasHydrated: false,
      setHydrated: (hasHydrated) => set({ hasHydrated }),
      completeOnboarding: () => set({ onboarded: true }),
      resetOnboarding: () => set({ onboarded: false }),
    }),
    {
      name: STORAGE_KEYS.onboarded,
      storage: createJSONStorage(() => zustandStorage),
      partialize: (s) => ({ onboarded: s.onboarded }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
