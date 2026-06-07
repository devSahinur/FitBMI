import { pad2 } from './format';

/** ISO date key (yyyy-mm-dd) in local time. */
export function toDateKey(date: Date | number = new Date()): string {
  const d = typeof date === 'number' ? new Date(date) : date;
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function startOfDay(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function daysAgo(n: number, from: Date = new Date()): Date {
  const d = startOfDay(from);
  d.setDate(d.getDate() - n);
  return d;
}

export function lastNDays(n: number, from: Date = new Date()): string[] {
  return Array.from({ length: n }, (_, i) => toDateKey(daysAgo(n - 1 - i, from)));
}

export function greetingForHour(hour: number = new Date().getHours()): string {
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function relativeDate(ts: number, now: number = Date.now()): string {
  const diff = now - ts;
  const day = 86_400_000;
  if (diff < day && new Date(ts).getDate() === new Date(now).getDate())
    return 'Today';
  if (diff < 2 * day) return 'Yesterday';
  if (diff < 7 * day) return `${Math.floor(diff / day)} days ago`;
  return new Date(ts).toLocaleDateString();
}

/**
 * Count the trailing streak of consecutive dates ending today.
 * @param dateKeys set of ISO date keys that have an entry
 */
export function currentStreak(
  dateKeys: Set<string>,
  today: Date = new Date(),
): number {
  let streak = 0;
  const cursor = startOfDay(today);
  // Allow the streak to be "alive" even if today isn't logged yet.
  if (!dateKeys.has(toDateKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  while (dateKeys.has(toDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
