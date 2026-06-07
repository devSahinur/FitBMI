import {
  xpToReachLevel,
  levelForXp,
  levelProgress,
  titleForLevel,
} from '../xp';

describe('xp utils', () => {
  it('computes cumulative xp thresholds', () => {
    expect(xpToReachLevel(1)).toBe(0);
    expect(xpToReachLevel(2)).toBe(100);
    expect(xpToReachLevel(3)).toBe(300);
    expect(xpToReachLevel(4)).toBe(600);
  });

  it('maps xp to the correct level', () => {
    expect(levelForXp(0)).toBe(1);
    expect(levelForXp(99)).toBe(1);
    expect(levelForXp(100)).toBe(2);
    expect(levelForXp(299)).toBe(2);
    expect(levelForXp(300)).toBe(3);
  });

  it('is monotonic across a range', () => {
    let prev = 1;
    for (let xp = 0; xp <= 5000; xp += 137) {
      const lvl = levelForXp(xp);
      expect(lvl).toBeGreaterThanOrEqual(prev);
      prev = lvl;
    }
  });

  it('reports progress within a level', () => {
    const p = levelProgress(150);
    expect(p.level).toBe(2);
    expect(p.current).toBe(50);
    expect(p.needed).toBe(200);
    expect(p.pct).toBeCloseTo(0.25, 5);
  });

  it('assigns titles by level', () => {
    expect(titleForLevel(1)).toBe('Rookie');
    expect(titleForLevel(5)).toBe('Achiever');
    expect(titleForLevel(99)).toBe('Legend');
  });
});
