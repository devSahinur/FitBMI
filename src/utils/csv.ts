import type { BMIRecord } from '@/types';
import { CATEGORY_META } from '@/constants';

function escapeCell(value: string | number): string {
  const s = String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

const HISTORY_HEADERS = [
  'Date',
  'BMI',
  'Category',
  'Weight (kg)',
  'Height (cm)',
  'Age',
  'Gender',
  'Unit',
];

/** Serialise BMI history into a CSV string. */
export function historyToCSV(records: BMIRecord[]): string {
  const rows = records.map((r) =>
    [
      new Date(r.createdAt).toISOString(),
      r.bmi,
      CATEGORY_META[r.category].label,
      r.weightKg,
      r.heightCm,
      r.age,
      r.gender,
      r.unit,
    ]
      .map(escapeCell)
      .join(','),
  );
  return [HISTORY_HEADERS.join(','), ...rows].join('\n');
}

/** Build a shareable plain-text report for a single record. */
export function recordToShareText(r: BMIRecord): string {
  const meta = CATEGORY_META[r.category];
  return [
    '🏋️ FitBMI Result',
    `BMI: ${r.bmi} (${meta.label})`,
    `Weight: ${r.weightKg} kg`,
    `Height: ${r.heightCm} cm`,
    `Healthy range: ${meta.range}`,
    `Date: ${new Date(r.createdAt).toLocaleString()}`,
  ].join('\n');
}
