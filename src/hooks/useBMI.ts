import { useMemo } from 'react';
import { calculateBMI } from '@/utils/bmi';
import type { BMIResult } from '@/types';

/** Memoised BMI computation from metric inputs. */
export function useBMI(weightKg: number, heightCm: number): BMIResult {
  return useMemo(
    () => calculateBMI(weightKg, heightCm),
    [weightKg, heightCm],
  );
}
