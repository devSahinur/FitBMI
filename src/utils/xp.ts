/**
 * XP / level math.
 *
 * Each level L (>=2) costs 100*(L-1) XP over the previous, so the total XP
 * required to *reach* level L is 50 * L * (L - 1).
 */

export function xpToReachLevel(level: number): number {
  const l = Math.max(1, Math.floor(level));
  return 50 * l * (l - 1);
}

export function levelForXp(xp: number): number {
  if (xp <= 0) return 1;
  // Solve 50*L*(L-1) <= xp  →  L = floor((50 + sqrt(2500 + 200*xp)) / 100)
  const level = Math.floor((50 + Math.sqrt(2500 + 200 * xp)) / 100);
  return Math.max(1, level);
}

export interface LevelProgress {
  level: number;
  /** XP accumulated within the current level. */
  current: number;
  /** XP needed to advance to the next level. */
  needed: number;
  /** 0..1 progress through the current level. */
  pct: number;
  totalXp: number;
}

export function levelProgress(xp: number): LevelProgress {
  const safeXp = Math.max(0, Math.floor(xp));
  const level = levelForXp(safeXp);
  const base = xpToReachLevel(level);
  const next = xpToReachLevel(level + 1);
  const needed = next - base;
  const current = safeXp - base;
  return {
    level,
    current,
    needed,
    pct: needed > 0 ? current / needed : 0,
    totalXp: safeXp,
  };
}

export function titleForLevel(level: number): string {
  if (level >= 25) return 'Legend';
  if (level >= 15) return 'Champion';
  if (level >= 10) return 'Athlete';
  if (level >= 5) return 'Achiever';
  if (level >= 2) return 'Starter';
  return 'Rookie';
}
