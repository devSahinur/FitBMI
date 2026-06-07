import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Persistence layer backed by AsyncStorage.
 *
 * AsyncStorage is bundled in Expo Go, so the app runs without a custom dev
 * client. (For a production dev build you can swap this for react-native-mmkv
 * — only this file and the Zustand `storage` adapter would change.)
 */
export const storage = {
  async getItem<T>(key: string, fallback: T): Promise<T> {
    try {
      const raw = await AsyncStorage.getItem(key);
      return raw == null ? fallback : (JSON.parse(raw) as T);
    } catch {
      return fallback;
    }
  },
  async setItem<T>(key: string, value: T): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },
  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  },
  async clearAll(): Promise<void> {
    await AsyncStorage.clear();
  },
};

/**
 * Adapter for Zustand's persist middleware. AsyncStorage already satisfies the
 * async StateStorage contract (getItem/setItem/removeItem returning Promises).
 */
export const zustandStorage = AsyncStorage;
