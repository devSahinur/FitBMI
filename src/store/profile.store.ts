import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Goals, Profile } from '@/types';
import { DEFAULT_GOALS, STORAGE_KEYS } from '@/constants';
import { zustandStorage } from '@/services/storage.service';

interface ProfileState {
  profile: Profile;
  goals: Goals;
  setProfile: (patch: Partial<Profile>) => void;
  setGoals: (patch: Partial<Goals>) => void;
  reset: () => void;
}

const defaultProfile: Profile = {
  name: 'Guest',
  gender: 'other',
  age: 25,
  heightCm: 170,
  currentWeightKg: 70,
  targetWeightKg: 65,
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: defaultProfile,
      goals: DEFAULT_GOALS,
      setProfile: (patch) =>
        set((s) => ({ profile: { ...s.profile, ...patch } })),
      setGoals: (patch) => set((s) => ({ goals: { ...s.goals, ...patch } })),
      reset: () => set({ profile: defaultProfile, goals: DEFAULT_GOALS }),
    }),
    {
      name: STORAGE_KEYS.profile,
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
