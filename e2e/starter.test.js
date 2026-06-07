/* eslint-disable no-undef */
/**
 * Detox e2e smoke test (scaffold).
 *
 * Detox requires a native build (it does NOT run in Expo Go). To use:
 *   1. npm i -D detox @config-plugins/detox jest
 *   2. npx expo prebuild
 *   3. detox build -c android.emu.debug
 *   4. detox test  -c android.emu.debug
 *
 * Add testID props to components you want to target (e.g. the tab bar items
 * and the "Calculate BMI" button) and assert on them below.
 */
describe('FitBMI smoke', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  it('launches to the Home tab', async () => {
    await expect(element(by.text('Today\'s summary'))).toBeVisible();
  });

  it('navigates to the BMI calculator', async () => {
    await element(by.text('BMI')).tap();
    await expect(element(by.text('Calculate BMI'))).toBeVisible();
  });

  it('opens the AI studio', async () => {
    await element(by.text('AI')).tap();
    await expect(element(by.text('AI Studio'))).toBeVisible();
  });
});
