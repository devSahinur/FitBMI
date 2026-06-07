import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from '@/services/storage.service';
import { levelForXp, levelProgress, type LevelProgress } from '@/utils/xp';
import { toDateKey } from '@/utils/date';

export interface DailyChallenge {
  id: string;
  title: string;
  xp: number;
  coins: number;
}

export const DAILY_CHALLENGES: DailyChallenge[] = [
  { id: 'log-weight', title: 'Log your weight', xp: 15, coins: 5 },
  { id: 'hit-water', title: 'Hit your water goal', xp: 20, coins: 8 },
  { id: 'ask-coach', title: 'Ask the AI coach', xp: 10, coins: 4 },
  { id: 'log-sleep', title: 'Log your sleep', xp: 15, coins: 5 },
];

export const WEEKLY_CHALLENGES: DailyChallenge[] = [
  { id: 'streak-5', title: 'Check in 5 days', xp: 60, coins: 30 },
  { id: 'workout-3', title: 'Generate 3 workouts', xp: 50, coins: 25 },
];

export interface WheelReward {
  type: 'coins' | 'xp';
  amount: number;
  label: string;
}

/** Reward wheel segments (clockwise from the top). */
export const REWARD_WHEEL: WheelReward[] = [
  { type: 'coins', amount: 10, label: '10 🪙' },
  { type: 'xp', amount: 20, label: '20 XP' },
  { type: 'coins', amount: 25, label: '25 🪙' },
  { type: 'xp', amount: 50, label: '50 XP' },
  { type: 'coins', amount: 5, label: '5 🪙' },
  { type: 'coins', amount: 50, label: '50 🪙' },
];

interface GamificationState {
  xp: number;
  coins: number;
  /** Consecutive daily check-in streak. */
  streak: number;
  lastCheckIn: string | null; // date key
  lastSpin: string | null; // date key
  completedToday: { date: string; ids: string[] };

  awardXp: (amount: number, _reason?: string) => { leveledUp: boolean };
  addCoins: (n: number) => void;
  spendCoins: (n: number) => boolean;
  checkIn: () => { alreadyDone: boolean; xp: number; coins: number; streak: number };
  canSpin: () => boolean;
  /** Pick a wheel segment index (does not mutate state). */
  pickSpin: () => number;
  /** Apply the reward for a wheel segment and mark today's spin used. */
  applySpin: (index: number) => WheelReward;
  completeChallenge: (c: DailyChallenge) => boolean;
  isChallengeDone: (id: string) => boolean;
  progress: () => LevelProgress;
  reset: () => void;
}

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      xp: 0,
      coins: 0,
      streak: 0,
      lastCheckIn: null,
      lastSpin: null,
      completedToday: { date: toDateKey(), ids: [] },

      awardXp: (amount) => {
        const before = levelForXp(get().xp);
        const xp = get().xp + Math.max(0, amount);
        const after = levelForXp(xp);
        const leveledUp = after > before;
        // Bonus coins on level up.
        set({ xp, coins: get().coins + (leveledUp ? after * 10 : 0) });
        return { leveledUp };
      },

      addCoins: (n) => set((s) => ({ coins: s.coins + Math.max(0, n) })),

      spendCoins: (n) => {
        if (get().coins < n) return false;
        set((s) => ({ coins: s.coins - n }));
        return true;
      },

      checkIn: () => {
        const today = toDateKey();
        const last = get().lastCheckIn;
        if (last === today) {
          return { alreadyDone: true, xp: 0, coins: 0, streak: get().streak };
        }
        // Continue streak if last check-in was yesterday, else reset.
        const yesterday = toDateKey(Date.now() - 86_400_000);
        const streak = last === yesterday ? get().streak + 1 : 1;
        const xp = 10 + Math.min(streak, 7) * 2;
        const coins = 5 + Math.min(streak, 10);
        set((s) => ({
          lastCheckIn: today,
          streak,
          xp: s.xp + xp,
          coins: s.coins + coins,
        }));
        return { alreadyDone: false, xp, coins, streak };
      },

      canSpin: () => get().lastSpin !== toDateKey(),

      pickSpin: () =>
        Math.floor(Math.random() * REWARD_WHEEL.length) % REWARD_WHEEL.length,

      applySpin: (index) => {
        const reward = REWARD_WHEEL[index % REWARD_WHEEL.length]!;
        set((s) => ({
          lastSpin: toDateKey(),
          coins: s.coins + (reward.type === 'coins' ? reward.amount : 0),
          xp: s.xp + (reward.type === 'xp' ? reward.amount : 0),
        }));
        return reward;
      },

      completeChallenge: (c) => {
        const today = toDateKey();
        let { completedToday } = get();
        if (completedToday.date !== today) {
          completedToday = { date: today, ids: [] };
        }
        if (completedToday.ids.includes(c.id)) return false;
        set((s) => ({
          completedToday: {
            date: today,
            ids: [...completedToday.ids, c.id],
          },
          xp: s.xp + c.xp,
          coins: s.coins + c.coins,
        }));
        return true;
      },

      isChallengeDone: (id) => {
        const { completedToday } = get();
        return (
          completedToday.date === toDateKey() &&
          completedToday.ids.includes(id)
        );
      },

      progress: () => levelProgress(get().xp),

      reset: () =>
        set({
          xp: 0,
          coins: 0,
          streak: 0,
          lastCheckIn: null,
          lastSpin: null,
          completedToday: { date: toDateKey(), ids: [] },
        }),
    }),
    {
      name: 'fitbmi.gamification',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
