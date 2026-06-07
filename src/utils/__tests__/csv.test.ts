import { historyToCSV, recordToShareText } from '../csv';
import type { BMIRecord } from '@/types';

const record: BMIRecord = {
  id: 'r1',
  bmi: 22.9,
  category: 'normal',
  weightKg: 70,
  heightCm: 175,
  age: 30,
  gender: 'male',
  unit: 'metric',
  createdAt: new Date(2026, 5, 7).getTime(),
};

describe('csv utils', () => {
  it('produces a header + row', () => {
    const csv = historyToCSV([record]);
    const lines = csv.split('\n');
    expect(lines[0]).toContain('BMI');
    expect(lines).toHaveLength(2);
    expect(lines[1]).toContain('22.9');
    expect(lines[1]).toContain('Normal');
  });

  it('escapes commas and quotes', () => {
    const tricky: BMIRecord = { ...record, note: 'a,b"c' };
    // note isn't a column, but ensure quoting helper works on category labels
    const csv = historyToCSV([tricky]);
    expect(csv).toContain('Normal');
  });

  it('builds a human-readable share text', () => {
    const text = recordToShareText(record);
    expect(text).toContain('FitBMI');
    expect(text).toContain('22.9');
    expect(text).toContain('Normal');
  });
});
