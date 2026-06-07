import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { HealthEntry } from '@/types';
import { STORAGE_KEYS } from '@/constants';
import { zustandStorage } from '@/services/storage.service';
import { uid } from '@/utils/id';
import { toDateKey } from '@/utils/date';

interface HealthState {
  entries: Record<string, HealthEntry>; // keyed by date (yyyy-mm-dd)
  /** Upsert today's (or a given date's) metrics. */
  upsert: (patch: Partial<Omit<HealthEntry, 'id' | 'date'>>, date?: string) => void;
  /** Add to a cumulative metric (e.g. water intake) for a date. */
  increment: (
    key: 'waterMl' | 'calories' | 'steps',
    amount: number,
    date?: string,
  ) => void;
  getByDate: (date: string) => HealthEntry | undefined;
  remove: (date: string) => void;
  clear: () => void;
}

export const useHealthStore = create<HealthState>()(
  persist(
    (set, get) => ({
      entries: {},
      upsert: (patch, date = toDateKey()) =>
        set((s) => {
          const prev = s.entries[date] ?? { id: uid('h'), date };
          return { entries: { ...s.entries, [date]: { ...prev, ...patch } } };
        }),
      increment: (key, amount, date = toDateKey()) =>
        set((s) => {
          const prev = s.entries[date] ?? { id: uid('h'), date };
          return {
            entries: {
              ...s.entries,
              [date]: { ...prev, [key]: (prev[key] ?? 0) + amount },
            },
          };
        }),
      getByDate: (date) => get().entries[date],
      remove: (date) =>
        set((s) => {
          const next = { ...s.entries };
          delete next[date];
          return { entries: next };
        }),
      clear: () => set({ entries: {} }),
    }),
    {
      name: STORAGE_KEYS.health,
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);

/** Selector: entries sorted ascending by date. */
export const selectSortedEntries = (s: HealthState): HealthEntry[] =>
  Object.values(s.entries).sort((a, b) => a.date.localeCompare(b.date));
