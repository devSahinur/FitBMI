import { useMemo } from 'react';
import { useHealthStore } from '@/store/health.store';
import { currentStreak } from '@/utils/date';

/** Current consecutive-day logging streak derived from health entries. */
export function useStreak(): number {
  const entries = useHealthStore((s) => s.entries);
  return useMemo(() => {
    const keys = new Set(Object.keys(entries));
    return currentStreak(keys);
  }, [entries]);
}
