import { useEffect } from 'react';
import { PedometerService } from '@/services/pedometer.service';
import { useHealthStore } from '@/store/health.store';
import { useStepLiveStore } from '@/store/steps.store';
import { toDateKey } from '@/utils/date';

/**
 * Starts live pedometer tracking for the session and writes today's step count
 * into the health store in real time. Call once near the top of the app (the
 * tab layout). Falls back silently to manual entry when unavailable.
 */
export function useStepTracking(): void {
  const setLive = useStepLiveStore((s) => s.setLive);

  useEffect(() => {
    let mounted = true;
    let sub: ReturnType<typeof PedometerService.watch> | undefined;

    (async () => {
      const available = await PedometerService.isAvailable();
      if (!available || !mounted) return;

      const granted = await PedometerService.ensurePermission();
      if (!granted || !mounted) return;

      // Baseline = today's total (historical) if available, else the value
      // already stored (manual entries); live deltas are added on top.
      const historical = await PedometerService.todayTotal();
      const stored = useHealthStore.getState().entries[toDateKey()]?.steps ?? 0;
      const baseline = historical ?? stored;

      if (historical != null) {
        useHealthStore.getState().upsert({ steps: Math.round(historical) });
      }

      sub = PedometerService.watch((stepsSinceStart) => {
        const total = Math.round(baseline + stepsSinceStart);
        // Only update today's record; never reduce a manually higher count.
        const current =
          useHealthStore.getState().entries[toDateKey()]?.steps ?? 0;
        if (total >= current) useHealthStore.getState().upsert({ steps: total });
      });

      if (mounted) setLive(true);
    })();

    return () => {
      mounted = false;
      sub?.remove();
      setLive(false);
    };
  }, [setLive]);
}
