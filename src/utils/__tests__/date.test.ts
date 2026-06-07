import {
  toDateKey,
  lastNDays,
  greetingForHour,
  currentStreak,
  relativeDate,
} from '../date';

describe('date utils', () => {
  it('formats a date key as yyyy-mm-dd', () => {
    const d = new Date(2026, 5, 7); // June 7 2026
    expect(toDateKey(d)).toBe('2026-06-07');
  });

  it('returns N ascending day keys', () => {
    const days = lastNDays(7, new Date(2026, 5, 7));
    expect(days).toHaveLength(7);
    expect(days[6]).toBe('2026-06-07');
    expect(days[0]).toBe('2026-06-01');
  });

  it('greets by time of day', () => {
    expect(greetingForHour(9)).toMatch(/morning/i);
    expect(greetingForHour(14)).toMatch(/afternoon/i);
    expect(greetingForHour(20)).toMatch(/evening/i);
  });

  it('counts consecutive streak ending today', () => {
    const today = new Date(2026, 5, 7);
    const keys = new Set([
      '2026-06-07',
      '2026-06-06',
      '2026-06-05',
      '2026-06-03', // gap
    ]);
    expect(currentStreak(keys, today)).toBe(3);
  });

  it('keeps streak alive if today not yet logged', () => {
    const today = new Date(2026, 5, 7);
    const keys = new Set(['2026-06-06', '2026-06-05']);
    expect(currentStreak(keys, today)).toBe(2);
  });

  it('describes relative dates', () => {
    const now = new Date(2026, 5, 7, 12).getTime();
    const today = new Date(2026, 5, 7, 9).getTime();
    expect(relativeDate(today, now)).toBe('Today');
  });
});
