import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { AppSettings } from '@/types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export type ReminderKey =
  | 'drinkWater'
  | 'measureWeight'
  | 'sleepReminder'
  | 'morningMotivation';

interface ReminderDef {
  key: ReminderKey;
  title: string;
  body: string;
  hour: number;
  minute: number;
  repeats: boolean;
}

const REMINDERS: ReminderDef[] = [
  {
    key: 'drinkWater',
    title: '💧 Time to hydrate',
    body: 'Drink a glass of water to stay on track.',
    hour: 10,
    minute: 0,
    repeats: true,
  },
  {
    key: 'measureWeight',
    title: '⚖️ Daily weigh-in',
    body: 'Log your weight to keep your trends accurate.',
    hour: 8,
    minute: 0,
    repeats: true,
  },
  {
    key: 'sleepReminder',
    title: '😴 Wind down',
    body: 'Time to prepare for a good night’s sleep.',
    hour: 22,
    minute: 0,
    repeats: true,
  },
  {
    key: 'morningMotivation',
    title: '🌅 Good morning!',
    body: 'A new day, a new chance to feel great.',
    hour: 7,
    minute: 30,
    repeats: true,
  },
];

class NotificationServiceImpl {
  async requestPermissions(): Promise<boolean> {
    const settings = await Notifications.getPermissionsAsync();
    let granted = settings.granted;
    if (!granted) {
      const req = await Notifications.requestPermissionsAsync();
      granted = req.granted;
    }
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('reminders', {
        name: 'Reminders',
        importance: Notifications.AndroidImportance.DEFAULT,
        lightColor: '#00C897',
      });
    }
    return granted;
  }

  /** Reconcile scheduled notifications with the user's settings. */
  async sync(settings: AppSettings['notifications']): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
    if (!settings.enabled) return;

    const granted = await this.requestPermissions();
    if (!granted) return;

    for (const r of REMINDERS) {
      if (!settings[r.key]) continue;
      await Notifications.scheduleNotificationAsync({
        identifier: r.key,
        content: { title: r.title, body: r.body },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: r.hour,
          minute: r.minute,
        },
      });
    }
  }

  async cancelAll(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }
}

export const NotificationService = new NotificationServiceImpl();
