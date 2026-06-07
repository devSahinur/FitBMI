import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AchievementId } from '@/types';
import { STORAGE_KEYS } from '@/constants';
import { zustandStorage } from '@/services/storage.service';

interface AchievementsState {
  unlocked: Partial<Record<AchievementId, number>>; // id -> unlockedAt
  /** Unlock an achievement. Returns true only the first time it unlocks. */
  unlock: (id: AchievementId) => boolean;
  isUnlocked: (id: AchievementId) => boolean;
  reset: () => void;
}

export const useAchievementsStore = create<AchievementsState>()(
  persist(
    (set, get) => ({
      unlocked: {},
      unlock: (id) => {
        if (get().unlocked[id]) return false;
        set((s) => ({ unlocked: { ...s.unlocked, [id]: Date.now() } }));
        return true;
      },
      isUnlocked: (id) => Boolean(get().unlocked[id]),
      reset: () => set({ unlocked: {} }),
    }),
    {
      name: STORAGE_KEYS.achievements,
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
