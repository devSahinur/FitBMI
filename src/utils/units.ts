import { round } from './bmi';

const KG_PER_LB = 0.453592;
const CM_PER_IN = 2.54;
const IN_PER_FT = 12;

export const lbToKg = (lb: number): number => round(lb * KG_PER_LB, 2);
export const kgToLb = (kg: number): number => round(kg / KG_PER_LB, 1);
export const inToCm = (inches: number): number => round(inches * CM_PER_IN, 1);
export const cmToIn = (cm: number): number => round(cm / CM_PER_IN, 1);

/** Convert centimetres to a {ft, in} pair for imperial height inputs. */
export function cmToFtIn(cm: number): { ft: number; in: number } {
  const totalIn = cmToIn(cm);
  const ft = Math.floor(totalIn / IN_PER_FT);
  const inch = round(totalIn - ft * IN_PER_FT, 0);
  return { ft, in: inch };
}

export function ftInToCm(ft: number, inch: number): number {
  return inToCm(ft * IN_PER_FT + inch);
}
