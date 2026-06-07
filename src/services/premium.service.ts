import type { PremiumFlags } from '@/types';
import { DEFAULT_PREMIUM, FREE_HISTORY_LIMIT, STORAGE_KEYS } from '@/constants';
import { storage } from './storage.service';

/**
 * Subscription / feature-flag gateway.
 *
 * This is wired for a future IAP provider (RevenueCat, expo-in-app-purchases).
 * Until then, flags are persisted locally and can be toggled for testing.
 */
class PremiumServiceImpl {
  // In-memory cache; the source of truth is persisted asynchronously.
  private flags: PremiumFlags = { ...DEFAULT_PREMIUM };

  /** Load persisted flags from storage. Call once on app start. */
  async hydrate(): Promise<PremiumFlags> {
    this.flags = await storage.getItem(STORAGE_KEYS.premium, DEFAULT_PREMIUM);
    return this.flags;
  }

  getFlags(): PremiumFlags {
    return this.flags;
  }

  isActive(): boolean {
    return Object.values(this.flags).some(Boolean);
  }

  has(flag: keyof PremiumFlags): boolean {
    return this.flags[flag];
  }

  setFlags(partial: Partial<PremiumFlags>): PremiumFlags {
    this.flags = { ...this.flags, ...partial };
    void storage.setItem(STORAGE_KEYS.premium, this.flags);
    return this.flags;
  }

  /** Returns true if a new history record is allowed under the current tier. */
  canAddHistory(currentCount: number): boolean {
    if (this.flags.unlimitedHistory) return true;
    return currentCount < FREE_HISTORY_LIMIT;
  }

  /** Restore purchases — stubbed for the chosen IAP provider. */
  async restore(): Promise<PremiumFlags> {
    return this.flags;
  }
}

export const PremiumService = new PremiumServiceImpl();
