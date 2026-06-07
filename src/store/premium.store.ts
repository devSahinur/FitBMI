import { create } from 'zustand';
import type { PremiumFlags } from '@/types';
import { PremiumService } from '@/services/premium.service';
import { AdMobService } from '@/services/admob.service';

interface PremiumState {
  flags: PremiumFlags;
  hydrate: () => Promise<void>;
  setFlag: (flag: keyof PremiumFlags, value: boolean) => void;
  restore: () => Promise<void>;
  isActive: () => boolean;
}

/**
 * Reactive mirror of PremiumService so screens re-render when flags change.
 * The service remains the source of truth + persistence layer.
 */
export const usePremiumStore = create<PremiumState>((set, get) => ({
  flags: PremiumService.getFlags(),
  hydrate: async () => {
    await PremiumService.hydrate();
    if (PremiumService.getFlags().removeAds) AdMobService.setRemoveAds(true);
    set({ flags: { ...PremiumService.getFlags() } });
  },
  setFlag: (flag, value) => {
    const flags = PremiumService.setFlags({ [flag]: value });
    if (flag === 'removeAds') AdMobService.setRemoveAds(value);
    set({ flags: { ...flags } });
  },
  restore: async () => {
    const flags = await PremiumService.restore();
    set({ flags: { ...flags } });
  },
  isActive: () => Object.values(get().flags).some(Boolean),
}));
