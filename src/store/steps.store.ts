import { create } from 'zustand';

interface StepLiveState {
  /** True when live pedometer tracking is active. */
  live: boolean;
  setLive: (live: boolean) => void;
}

/** Ephemeral (non-persisted) UI flag for live step tracking. */
export const useStepLiveStore = create<StepLiveState>((set) => ({
  live: false,
  setLive: (live) => set({ live }),
}));
