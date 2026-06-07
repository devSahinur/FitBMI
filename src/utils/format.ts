import type { UnitSystem } from '@/types';
import { kgToLb, cmToFtIn } from './units';
import { round } from './bmi';

export function formatWeight(kg: number, unit: UnitSystem): string {
  if (unit === 'imperial') return `${kgToLb(kg)} lb`;
  return `${round(kg, 1)} kg`;
}

export function formatHeight(cm: number, unit: UnitSystem): string {
  if (unit === 'imperial') {
    const { ft, in: inch } = cmToFtIn(cm);
    return `${ft}'${inch}"`;
  }
  return `${round(cm, 0)} cm`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

export function formatWater(ml: number, unit: UnitSystem): string {
  if (unit === 'imperial') return `${round(ml / 29.5735, 0)} oz`;
  return ml >= 1000 ? `${round(ml / 1000, 1)} L` : `${ml} ml`;
}

export function formatDuration(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}
