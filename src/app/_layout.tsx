import '../../global.css';
import React, { useCallback, useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Stack, useRouter } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import {
  useFonts,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';

import { useSettingsStore } from '@/store/settings.store';
import { usePremiumStore } from '@/store/premium.store';
import { useAppStore } from '@/store/app.store';
import { NotificationService } from '@/services/notifications.service';
import { AnimatedSplash } from '@/components/layout/AnimatedSplash';
import { setLanguage } from '@/i18n';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, retry: 1 } },
});

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [splashDone, setSplashDone] = useState(false);
  const [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
    Poppins_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });
  const systemScheme = useColorScheme();
  const router = useRouter();
  const themeMode = useSettingsStore((s) => s.themeMode);
  const notifications = useSettingsStore((s) => s.notifications);
  const language = useSettingsStore((s) => s.language);
  const onboarded = useAppStore((s) => s.onboarded);
  const hasHydrated = useAppStore((s) => s.hasHydrated);

  const isDark =
    themeMode === 'dark' || (themeMode === 'system' && systemScheme === 'dark');

  // Keep the i18n language in sync with the user's setting.
  useEffect(() => {
    setLanguage(language);
  }, [language]);

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

  // Hold the splash until bootstrap, fonts and persisted flags are ready.
  const appReady = ready && fontsLoaded && hasHydrated;

  // Route first-time users into onboarding once everything is ready.
  useEffect(() => {
    if (appReady && !onboarded) router.replace('/onboarding');
  }, [appReady, onboarded, router]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <BottomSheetModalProvider>
          <StatusBar style={isDark ? 'light' : 'dark'} />
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
              contentStyle: { backgroundColor: isDark ? '#0B0F1A' : '#F4F6FA' },
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
            <Stack.Screen name="ai/coach" />
            <Stack.Screen name="ai/meal" />
            <Stack.Screen name="ai/workout" />
            <Stack.Screen name="ai/recipe" />
            <Stack.Screen name="ai/goals" />
            <Stack.Screen name="ai/report" />
            <Stack.Screen name="rewards" />
            <Stack.Screen name="dashboard" />
            <Stack.Screen name="premium" options={{ presentation: 'modal' }} />
            <Stack.Screen name="auth/login" />
            <Stack.Screen name="auth/register" />
            <Stack.Screen name="auth/forgot" />
            <Stack.Screen name="auth/otp" />
            <Stack.Screen
              name="privacy"
              options={{ presentation: 'modal' }}
            />
            <Stack.Screen name="terms" options={{ presentation: 'modal' }} />
            <Stack.Screen name="about" options={{ presentation: 'modal' }} />
          </Stack>
          {!splashDone && (
            <AnimatedSplash ready={appReady} onFinish={onSplashFinish} />
          )}
          </BottomSheetModalProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
