/**
 * Lightweight unique id generator (no native crypto dependency).
 * Good enough for local record keys.
 */
let counter = 0;

export function uid(prefix = 'id'): string {
  counter = (counter + 1) % 1_000_000;
  const time = Date.now().toString(36);
  const rand = Math.floor(Math.random() * 1e9).toString(36);
  return `${prefix}_${time}${counter.toString(36)}${rand}`;
}
