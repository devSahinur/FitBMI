import { Pedometer } from 'expo-sensors';
import { startOfDay } from '@/utils/date';

type StepSubscription = ReturnType<typeof Pedometer.watchStepCount>;

/**
 * Real-time step tracking via the device pedometer (expo-sensors).
 *
 * - iOS: live + historical (CoreMotion) work in Expo Go.
 * - Android: live watching works; historical/daily totals + background
 *   counting need a development build (Health Connect / Google Fit) and the
 *   ACTIVITY_RECOGNITION runtime permission (declared in app.json).
 */
class PedometerServiceImpl {
  async isAvailable(): Promise<boolean> {
    try {
      return await Pedometer.isAvailableAsync();
    } catch {
      return false;
    }
  }

  /** Ensure motion/activity permission (no-op where not required). */
  async ensurePermission(): Promise<boolean> {
    try {
      const current = await Pedometer.getPermissionsAsync();
      if (current.granted) return true;
      if (!current.canAskAgain) return false;
      const req = await Pedometer.requestPermissionsAsync();
      return req.granted;
    } catch {
      // Some platforms don't gate the step counter behind a prompt.
      return true;
    }
  }

  /** Today's total step count, or null if historical data isn't available. */
  async todayTotal(): Promise<number | null> {
    try {
      const result = await Pedometer.getStepCountAsync(startOfDay(), new Date());
      return result?.steps ?? null;
    } catch {
      return null;
    }
  }

  /** Subscribe to live step updates. Callback receives steps since subscribe. */
  watch(onChange: (stepsSinceStart: number) => void): StepSubscription {
    return Pedometer.watchStepCount((result) => onChange(result.steps));
  }
}

export const PedometerService = new PedometerServiceImpl();
