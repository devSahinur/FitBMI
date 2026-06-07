import '../../global.css';
import React, { useCallback, useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { useSettingsStore } from '@/store/settings.store';
import { usePremiumStore } from '@/store/premium.store';
import { NotificationService } from '@/services/notifications.service';
import { AnimatedSplash } from '@/components/layout/AnimatedSplash';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, retry: 1 } },
});

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [splashDone, setSplashDone] = useState(false);
  const systemScheme = useColorScheme();
  const themeMode = useSettingsStore((s) => s.themeMode);
  const notifications = useSettingsStore((s) => s.notifications);

  const isDark =
    themeMode === 'dark' || (themeMode === 'system' && systemScheme === 'dark');

  useEffect(() => {
    (async () => {
      // Load persisted premium flags, then reconcile scheduled reminders.
      await usePremiumStore.getState().hydrate().catch(() => undefined);
      await NotificationService.sync(notifications).catch(() => undefined);
      setReady(true);
      await SplashScreen.hideAsync().catch(() => undefined);
    })();
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSplashFinish = useCallback(() => setSplashDone(true), []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style={isDark ? 'light' : 'dark'} />
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
              contentStyle: { backgroundColor: isDark ? '#0B0F1A' : '#F5F7FA' },
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="privacy"
              options={{ presentation: 'modal' }}
            />
            <Stack.Screen name="terms" options={{ presentation: 'modal' }} />
            <Stack.Screen name="about" options={{ presentation: 'modal' }} />
          </Stack>
          {!splashDone && (
            <AnimatedSplash ready={ready} onFinish={onSplashFinish} />
          )}
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
