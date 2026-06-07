import {
  useGamificationStore,
  DAILY_CHALLENGES,
  REWARD_WHEEL,
} from '../gamification.store';

const reset = () => useGamificationStore.getState().reset();

describe('gamification store', () => {
  beforeEach(reset);

  it('awards xp and levels up', () => {
    const { awardXp } = useGamificationStore.getState();
    const r = awardXp(120);
    expect(useGamificationStore.getState().xp).toBe(120);
    expect(r.leveledUp).toBe(true); // crossed 100 → level 2
  });

  it('adds and spends coins', () => {
    const s = useGamificationStore.getState();
    s.addCoins(50);
    expect(useGamificationStore.getState().coins).toBe(50);
    expect(s.spendCoins(20)).toBe(true);
    expect(useGamificationStore.getState().coins).toBe(30);
    expect(s.spendCoins(999)).toBe(false);
  });

  it('handles daily check-in once per day', () => {
    const s = useGamificationStore.getState();
    const first = s.checkIn();
    expect(first.alreadyDone).toBe(false);
    expect(first.streak).toBe(1);
    const second = s.checkIn();
    expect(second.alreadyDone).toBe(true);
  });

  it('completes a challenge only once', () => {
    const s = useGamificationStore.getState();
    const c = DAILY_CHALLENGES[0]!;
    expect(s.completeChallenge(c)).toBe(true);
    expect(s.completeChallenge(c)).toBe(false);
    expect(s.isChallengeDone(c.id)).toBe(true);
  });

  it('applies a wheel reward and marks spin used', () => {
    const s = useGamificationStore.getState();
    expect(s.canSpin()).toBe(true);
    const reward = s.applySpin(0);
    expect(reward).toEqual(REWARD_WHEEL[0]);
    expect(useGamificationStore.getState().canSpin()).toBe(false);
  });
});
