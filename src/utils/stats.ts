/** Small numeric helpers for statistics cards and charts. */

export function sum(values: number[]): number {
  return values.reduce((a, b) => a + b, 0);
}

export function average(values: number[]): number {
  if (values.length === 0) return 0;
  return sum(values) / values.length;
}

export function min(values: number[]): number {
  return values.length ? Math.min(...values) : 0;
}

export function max(values: number[]): number {
  return values.length ? Math.max(...values) : 0;
}

/** Percentage change between first and last data point. */
export function trendPct(values: number[]): number {
  const first = values.find((v) => v !== 0);
  const last = [...values].reverse().find((v) => v !== 0);
  if (first === undefined || last === undefined || first === 0) return 0;
  return ((last - first) / first) * 100;
}

/** Simple moving average for smoothing chart lines. */
export function movingAverage(values: number[], window = 3): number[] {
  if (window <= 1) return values;
  return values.map((_, i) => {
    const start = Math.max(0, i - window + 1);
    return average(values.slice(start, i + 1));
  });
}
