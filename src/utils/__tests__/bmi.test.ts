import { calculateBMI, classifyBMI, clamp, round, weightToHealthy } from '../bmi';

describe('bmi utils', () => {
  describe('round', () => {
    it('rounds to one decimal by default', () => {
      expect(round(23.456)).toBe(23.5);
      expect(round(18.449)).toBe(18.4);
    });
    it('respects decimals arg', () => {
      expect(round(1.23456, 3)).toBe(1.235);
    });
  });

  describe('clamp', () => {
    it('clamps within range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-1, 0, 10)).toBe(0);
      expect(clamp(99, 0, 10)).toBe(10);
    });
  });

  describe('classifyBMI', () => {
    it('classifies each band correctly', () => {
      expect(classifyBMI(17)).toBe('underweight');
      expect(classifyBMI(18.5)).toBe('normal');
      expect(classifyBMI(22)).toBe('normal');
      expect(classifyBMI(25)).toBe('overweight');
      expect(classifyBMI(27)).toBe('overweight');
      expect(classifyBMI(30)).toBe('obese');
      expect(classifyBMI(42)).toBe('obese');
    });
  });

  describe('calculateBMI', () => {
    it('computes a normal BMI', () => {
      const res = calculateBMI(70, 175);
      expect(res.bmi).toBeCloseTo(22.9, 1);
      expect(res.category).toBe('normal');
      expect(res.gaugeProgress).toBeGreaterThan(0);
      expect(res.gaugeProgress).toBeLessThanOrEqual(1);
    });

    it('returns a healthy range ordered low..high', () => {
      const [lo, hi] = calculateBMI(70, 175).healthyRange;
      expect(lo).toBeLessThan(hi);
    });

    it('handles zero height without crashing', () => {
      const res = calculateBMI(70, 0);
      expect(res.bmi).toBe(0);
    });
  });

  describe('weightToHealthy', () => {
    it('suggests losing weight when overweight', () => {
      // ~95kg at 175cm is overweight; suggestion should be negative
      expect(weightToHealthy(95, 175)).toBeLessThan(0);
    });
  });
});
