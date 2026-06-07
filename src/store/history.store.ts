import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { BMIRecord } from '@/types';
import { STORAGE_KEYS } from '@/constants';
import { zustandStorage } from '@/services/storage.service';
import { PremiumService } from '@/services/premium.service';
import { uid } from '@/utils/id';

interface HistoryState {
  records: BMIRecord[];
  add: (record: Omit<BMIRecord, 'id' | 'createdAt'>) => BMIRecord | null;
  remove: (id: string) => void;
  clear: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      records: [],
      add: (record) => {
        if (!PremiumService.canAddHistory(get().records.length)) {
          // Free tier limit reached — caller should prompt upgrade.
          return null;
        }
        const full: BMIRecord = {
          ...record,
          id: uid('bmi'),
          createdAt: Date.now(),
        };
        set((s) => ({ records: [full, ...s.records] }));
        return full;
      },
      remove: (id) =>
        set((s) => ({ records: s.records.filter((r) => r.id !== id) })),
      clear: () => set({ records: [] }),
    }),
    {
      name: STORAGE_KEYS.history,
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
