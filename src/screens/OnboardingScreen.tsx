import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  Pressable,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  withSpring,
  type SharedValue,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { icons, ChevronRight } from 'lucide-react-native';

import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { useTheme } from '@/hooks/useTheme';
import { useHaptics } from '@/hooks/useHaptics';
import { palette } from '@/theme';
import { useAppStore } from '@/store/app.store';
import { useSettingsStore } from '@/store/settings.store';
import { useProfileStore } from '@/store/profile.store';
import { NotificationService } from '@/services/notifications.service';
import type { Gender } from '@/types';

interface Slide {
  icon: keyof typeof icons;
  title: string;
  subtitle: string;
  colors: readonly [string, string];
}

const SLIDES: Slide[] = [
  {
    icon: 'HeartPulse',
    title: 'Welcome to FitBMI',
    subtitle: 'Your personal health & wellness companion — beautiful, private and smart.',
    colors: [palette.primary, palette.secondary],
  },
  {
    icon: 'Calculator',
    title: 'Track Your BMI',
    subtitle: 'Calculate your BMI with an animated gauge and clear, color-coded insights.',
    colors: ['#00C897', '#00A87E'],
  },
  {
    icon: 'Activity',
    title: 'Build Healthy Habits',
    subtitle: 'Log weight, water, sleep, calories and steps. Watch your streak grow.',
    colors: ['#00A8FF', '#0088CC'],
  },
  {
    icon: 'Sparkles',
    title: 'AI Health Coach',
    subtitle: 'Chat with an AI coach for personalised fitness, nutrition and wellness advice.',
    colors: ['#9D7BFF', '#7C5CFC'],
  },
  {
    icon: 'Target',
    title: 'Set Your Goals',
    subtitle: 'Define a target weight and daily goals — we’ll help you reach them.',
    colors: ['#FFB800', '#FF9F1C'],
  },
  {
    icon: 'Bell',
    title: 'Stay on Track',
    subtitle: 'Gentle daily reminders for water, weight, sleep and motivation.',
    colors: ['#FF5C8A', '#E11D74'],
  },
  {
    icon: 'Rocket',
    title: 'You’re All Set!',
    subtitle: 'Start your journey to a healthier you. Let’s go!',
    colors: [palette.primary, palette.secondary],
  },
];

const NOTIFICATIONS_PAGE = 5;

function SlideView({
  slide,
  index,
  scrollX,
  width,
  form,
}: {
  slide: Slide;
  index: number;
  scrollX: SharedValue<number>;
  width: number;
  form?: React.ReactNode;
}) {
  const Icon = icons[slide.icon] ?? icons.Heart;
  const animatedStyle = useAnimatedStyle(() => {
    const input = [(index - 1) * width, index * width, (index + 1) * width];
    return {
      transform: [
        { scale: interpolate(scrollX.value, input, [0.7, 1, 0.7]) },
        { translateY: interpolate(scrollX.value, input, [40, 0, 40]) },
      ],
      opacity: interpolate(scrollX.value, input, [0.3, 1, 0.3]),
    };
  });

  const heroSize = form ? 110 : 200;

  return (
    <View style={{ width }}>
      <ScrollView
        contentContainerStyle={styles.slide}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={animatedStyle}>
          <LinearGradient
            colors={slide.colors}
            style={[
              styles.heroCircle,
              { width: heroSize, height: heroSize, borderRadius: heroSize / 2 },
            ]}
          >
            <Icon size={heroSize * 0.44} color="#fff" strokeWidth={1.6} />
          </LinearGradient>
        </Animated.View>
        <Text variant="h1" style={styles.slideTitle}>
          {slide.title}
        </Text>
        <Text variant="body" tone="muted" style={styles.slideSubtitle}>
          {slide.subtitle}
        </Text>
        {form ? <View style={styles.form}>{form}</View> : null}
      </ScrollView>
    </View>
  );
}

export function OnboardingScreen() {
  const { isDark, colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const haptic = useHaptics();
  const { width } = useWindowDimensions();
  const scrollRef = useRef<Animated.ScrollView>(null);
  const scrollX = useSharedValue(0);
  const [page, setPage] = useState(0);

  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const setNotification = useSettingsStore((s) => s.setNotification);
  const profile = useProfileStore((s) => s.profile);
  const setProfile = useProfileStore((s) => s.setProfile);
  const setGoals = useProfileStore((s) => s.setGoals);

  const [pd, setPd] = useState({
    name: profile.name === 'Guest' ? '' : profile.name,
    gender: profile.gender,
    age: String(profile.age),
    height: String(profile.heightCm),
    weight: String(profile.currentWeightKg),
    target: String(profile.targetWeightKg),
  });

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = e.contentOffset.x;
    },
  });

  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setPage(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  const goTo = (p: number) => {
    scrollRef.current?.scrollTo({ x: p * width, animated: true });
    setPage(p);
  };

  const finish = () => {
    // Persist the info collected during onboarding.
    setProfile({
      name: pd.name.trim() || 'Guest',
      gender: pd.gender,
      age: Number(pd.age) || profile.age,
      heightCm: Number(pd.height) || profile.heightCm,
      currentWeightKg: Number(pd.weight) || profile.currentWeightKg,
      targetWeightKg: Number(pd.target) || profile.targetWeightKg,
    });
    setGoals({ targetWeightKg: Number(pd.target) || profile.targetWeightKg });
    haptic('success');
    completeOnboarding();
    router.replace('/(tabs)');
  };

  const set = (key: keyof typeof pd, value: string) =>
    setPd((s) => ({ ...s, [key]: value }));

  const welcomeForm = (
    <Field
      label="What should we call you?"
      placeholder="Your name"
      value={pd.name}
      onChangeText={(v) => set('name', v)}
    />
  );

  const goalsForm = (
    <View style={{ width: '100%', gap: 12 }}>
      <Text variant="label" tone="muted">
        Gender
      </Text>
      <SegmentedControl<Gender>
        segments={[
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' },
          { label: 'Other', value: 'other' },
        ]}
        value={pd.gender}
        onChange={(g) => setPd((s) => ({ ...s, gender: g }))}
      />
      <Field
        label="Age"
        keyboardType="number-pad"
        value={pd.age}
        onChangeText={(v) => set('age', v)}
        suffix="yrs"
      />
      <Field
        label="Height"
        keyboardType="decimal-pad"
        value={pd.height}
        onChangeText={(v) => set('height', v)}
        suffix="cm"
      />
      <Field
        label="Current weight"
        keyboardType="decimal-pad"
        value={pd.weight}
        onChangeText={(v) => set('weight', v)}
        suffix="kg"
      />
      <Field
        label="Target weight"
        keyboardType="decimal-pad"
        value={pd.target}
        onChangeText={(v) => set('target', v)}
        suffix="kg"
      />
    </View>
  );

  const formFor = (i: number): React.ReactNode =>
    i === 0 ? welcomeForm : i === 4 ? goalsForm : undefined;

  const next = async () => {
    haptic('light');
    if (page === NOTIFICATIONS_PAGE) {
      const granted = await NotificationService.requestPermissions().catch(
        () => false,
      );
      setNotification('enabled', granted);
    }
    if (page >= SLIDES.length - 1) finish();
    else goTo(page + 1);
  };

  const bg = isDark
    ? (['#0B0F1A', '#0E1626'] as const)
    : (['#F4F6FA', '#EAF0FA'] as const);

  const isLast = page === SLIDES.length - 1;

  return (
    <LinearGradient colors={bg} style={styles.fill}>
      {/* Skip */}
      <Pressable
        onPress={finish}
        style={[styles.skip, { top: insets.top + 12 }]}
        hitSlop={10}
        accessibilityRole="button"
      >
        {!isLast && (
          <Text variant="label" tone="muted">
            Skip
          </Text>
        )}
      </Pressable>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={onMomentumEnd}
        style={{ flex: 1 }}
      >
        {SLIDES.map((slide, i) => (
          <SlideView
            key={slide.title}
            slide={slide}
            index={i}
            scrollX={scrollX}
            width={width}
            form={formFor(i)}
          />
        ))}
      </Animated.ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <Dot key={i} index={i} scrollX={scrollX} width={width} color={colors.primary} />
          ))}
        </View>
        <Button
          title={
            isLast
              ? 'Get Started'
              : page === NOTIFICATIONS_PAGE
                ? 'Enable Notifications'
                : 'Next'
          }
          onPress={next}
          icon={!isLast ? <ChevronRight size={18} color="#fff" /> : undefined}
        />
      </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

function Dot({
  index,
  scrollX,
  width,
  color,
}: {
  index: number;
  scrollX: SharedValue<number>;
  width: number;
  color: string;
}) {
  const style = useAnimatedStyle(() => {
    const input = [(index - 1) * width, index * width, (index + 1) * width];
    const w = interpolate(scrollX.value, input, [8, 24, 8], 'clamp');
    const opacity = interpolate(scrollX.value, input, [0.3, 1, 0.3], 'clamp');
    return { width: withSpring(w), opacity };
  });
  return <Animated.View style={[styles.dot, { backgroundColor: color }, style]} />;
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  skip: { position: 'absolute', right: 20, zIndex: 10, height: 24, justifyContent: 'center' },
  slide: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
    gap: 20,
  },
  heroCircle: { alignItems: 'center', justifyContent: 'center' },
  slideTitle: { textAlign: 'center' },
  slideSubtitle: { textAlign: 'center', maxWidth: 340 },
  form: { width: '100%', gap: 12, marginTop: 8 },
  footer: { paddingHorizontal: 24, gap: 24 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, height: 8 },
  dot: { height: 8, borderRadius: 4 },
});
