import { BMI_GAUGE_MAX, BMI_THRESHOLDS } from '@/constants';
import type { BMICategory, BMIResult } from '@/types';

/** Round to a fixed number of decimals without floating-point noise. */
export function round(value: number, decimals = 1): number {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

/** Clamp a number into the inclusive [min, max] range. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function classifyBMI(bmi: number): BMICategory {
  if (bmi < BMI_THRESHOLDS.underweight) return 'underweight';
  if (bmi < BMI_THRESHOLDS.normal) return 'normal';
  if (bmi < BMI_THRESHOLDS.overweight) return 'overweight';
  return 'obese';
}

/**
 * Compute BMI from metric inputs.
 * @param weightKg weight in kilograms
 * @param heightCm height in centimetres
 */
export function calculateBMI(weightKg: number, heightCm: number): BMIResult {
  const heightM = heightCm / 100;
  const raw = heightM > 0 ? weightKg / (heightM * heightM) : 0;
  const bmi = round(raw, 1);
  const minHealthy = round(BMI_THRESHOLDS.underweight * heightM * heightM, 1);
  const maxHealthy = round((BMI_THRESHOLDS.normal - 0.1) * heightM * heightM, 1);

  return {
    bmi,
    category: classifyBMI(bmi),
    healthyRange: [minHealthy, maxHealthy],
    gaugeProgress: clamp(bmi / BMI_GAUGE_MAX, 0, 1),
  };
}

/** Suggest weight change (kg) to reach the centre of the healthy range. */
export function weightToHealthy(weightKg: number, heightCm: number): number {
  const [min, max] = calculateBMI(weightKg, heightCm).healthyRange;
  const mid = (min + max) / 2;
  return round(mid - weightKg, 1);
}
