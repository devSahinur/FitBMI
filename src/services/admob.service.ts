import { ADMOB_TEST_IDS } from '@/constants';

/**
 * AdMob abstraction layer.
 *
 * Ads are DISABLED by default. The real SDK (react-native-google-mobile-ads)
 * is intentionally not imported here so the app builds and runs in Expo Go
 * without native ad modules. To enable ads:
 *   1. `npx expo install react-native-google-mobile-ads`
 *   2. Add the config plugin + app IDs to app.json
 *   3. Replace the no-op implementations below with SDK calls
 *   4. Flip `AdMobService.enabled` (gated by the premium "removeAds" flag)
 */
export type AdUnit = 'banner' | 'interstitial' | 'rewarded';

interface AdMobConfig {
  enabled: boolean;
  testMode: boolean;
  unitIds: Record<AdUnit, string>;
}

class AdMobServiceImpl {
  private config: AdMobConfig = {
    enabled: false, // disabled by default per product spec
    testMode: __DEV__,
    unitIds: { ...ADMOB_TEST_IDS },
  };

  configure(partial: Partial<AdMobConfig>): void {
    this.config = { ...this.config, ...partial };
  }

  get enabled(): boolean {
    return this.config.enabled;
  }

  /** Premium "remove ads" overrides everything. */
  setRemoveAds(removeAds: boolean): void {
    if (removeAds) this.config.enabled = false;
  }

  unitId(unit: AdUnit): string {
    return this.config.unitIds[unit];
  }

  async initialize(): Promise<void> {
    if (!this.config.enabled) return;
    // await mobileAds().initialize();
  }

  async showInterstitial(): Promise<boolean> {
    if (!this.config.enabled) return false;
    // load + show interstitial here
    return false;
  }

  async showRewarded(): Promise<{ rewarded: boolean }> {
    if (!this.config.enabled) return { rewarded: false };
    // load + show rewarded here
    return { rewarded: false };
  }
}

export const AdMobService = new AdMobServiceImpl();
