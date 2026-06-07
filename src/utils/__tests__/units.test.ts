import {
  lbToKg,
  kgToLb,
  inToCm,
  cmToIn,
  cmToFtIn,
  ftInToCm,
} from '../units';

describe('unit conversions', () => {
  it('converts lb <-> kg', () => {
    expect(lbToKg(154.32)).toBeCloseTo(70, 0);
    expect(kgToLb(70)).toBeCloseTo(154.3, 0);
  });

  it('converts in <-> cm', () => {
    expect(inToCm(10)).toBeCloseTo(25.4, 1);
    expect(cmToIn(25.4)).toBeCloseTo(10, 1);
  });

  it('round trips cm -> ft/in -> cm approximately', () => {
    const { ft, in: inch } = cmToFtIn(180);
    const back = ftInToCm(ft, inch);
    expect(Math.abs(back - 180)).toBeLessThan(2);
  });
});
