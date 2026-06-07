import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { Coins, Flame, CheckCircle2, Circle as CircleIcon } from 'lucide-react-native';

import { ModalHeader } from '@/components/layout/ModalHeader';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { CircularProgress } from '@/components/ui/CircularProgress';
import { Confetti } from '@/components/ui/Confetti';
import { RewardWheel } from '@/components/gamification/RewardWheel';
import { useTheme } from '@/hooks/useTheme';
import { useHaptics } from '@/hooks/useHaptics';
import { palette } from '@/theme';
import {
  useGamificationStore,
  DAILY_CHALLENGES,
} from '@/store/gamification.store';
import { levelProgress, titleForLevel } from '@/utils/xp';

export function RewardsScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const haptic = useHaptics();

  const xp = useGamificationStore((s) => s.xp);
  const coins = useGamificationStore((s) => s.coins);
  const streak = useGamificationStore((s) => s.streak);
  const lastCheckIn = useGamificationStore((s) => s.lastCheckIn);
  const lastSpin = useGamificationStore((s) => s.lastSpin);
  const completedToday = useGamificationStore((s) => s.completedToday);
  const checkIn = useGamificationStore((s) => s.checkIn);
  const pickSpin = useGamificationStore((s) => s.pickSpin);
  const applySpin = useGamificationStore((s) => s.applySpin);
  const canSpinFn = useGamificationStore((s) => s.canSpin);
  const completeChallenge = useGamificationStore((s) => s.completeChallenge);

  const [confetti, setConfetti] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);

  const prog = levelProgress(xp);
  const today = new Date().toISOString().slice(0, 10);
  const checkedInToday = lastCheckIn === today;
  const canSpin = canSpinFn();

  const celebrate = (msg: string) => {
    setBanner(msg);
    setConfetti(true);
    haptic('success');
    setTimeout(() => setConfetti(false), 2200);
  };

  const onCheckIn = () => {
    const res = checkIn();
    if (res.alreadyDone) {
      setBanner('Already checked in today ✅');
      return;
    }
    celebrate(`+${res.xp} XP · +${res.coins} 🪙 · ${res.streak}-day streak!`);
  };

  const bg = isDark
    ? (['#0B0F1A', '#0E1626'] as const)
    : (['#F4F6FA', '#EAF0FA'] as const);

  return (
    <LinearGradient colors={bg} style={{ flex: 1 }}>
      <ModalHeader title="Rewards" />
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: insets.bottom + 32,
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Level + coins */}
        <GlassCard>
          <View style={styles.levelRow}>
            <CircularProgress progress={prog.pct} size={108} strokeWidth={10}>
              <Text variant="h2">{prog.level}</Text>
              <Text variant="label" tone="muted">
                LEVEL
              </Text>
            </CircularProgress>
            <View style={{ flex: 1, gap: 6 }}>
              <Text variant="h3">{titleForLevel(prog.level)}</Text>
              <Text variant="caption" tone="muted">
                {prog.current} / {prog.needed} XP to level {prog.level + 1}
              </Text>
              <View style={styles.coins}>
                <Coins size={18} color={palette.overweight} />
                <Text variant="title">{coins}</Text>
                <Text variant="caption" tone="muted">
                  coins
                </Text>
              </View>
            </View>
          </View>
        </GlassCard>

        {/* Daily check-in */}
        <GlassCard>
          <View style={styles.checkinRow}>
            <View style={[styles.flameWrap, { backgroundColor: `${palette.primary}1A` }]}>
              <Flame size={26} color={palette.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="title">{streak}-day streak</Text>
              <Text variant="caption" tone="muted">
                Check in daily to earn XP & coins
              </Text>
            </View>
          </View>
          <Button
            title={checkedInToday ? 'Checked in ✅' : 'Daily check-in'}
            onPress={onCheckIn}
            disabled={checkedInToday}
          />
        </GlassCard>

        {/* Reward wheel */}
        <SectionHeader title="Daily reward wheel" />
        <GlassCard>
          <RewardWheel
            pick={pickSpin}
            disabled={!canSpin}
            onResult={(i) => {
              const r = applySpin(i);
              celebrate(`You won ${r.label}!`);
            }}
          />
          {!canSpin && lastSpin === today ? (
            <Text variant="caption" tone="muted" style={styles.center}>
              You’ve spun today — come back tomorrow!
            </Text>
          ) : null}
        </GlassCard>

        {/* Daily challenges */}
        <SectionHeader title="Daily challenges" />
        {DAILY_CHALLENGES.map((c) => {
          const done =
            completedToday.date === today && completedToday.ids.includes(c.id);
          return (
            <GlassCard key={c.id} style={styles.challengeRow}>
              {done ? (
                <CheckCircle2 size={24} color={palette.primary} />
              ) : (
                <CircleIcon size={24} color={colors.textMuted} />
              )}
              <View style={{ flex: 1 }}>
                <Text variant="body">{c.title}</Text>
                <Text variant="caption" tone="muted">
                  +{c.xp} XP · +{c.coins} 🪙
                </Text>
              </View>
              {!done && (
                <Button
                  title="Claim"
                  variant="ghost"
                  fullWidth={false}
                  onPress={() => {
                    if (completeChallenge(c)) celebrate(`+${c.xp} XP!`);
                  }}
                />
              )}
            </GlassCard>
          );
        })}

        {banner ? (
          <Text variant="title" tone="primary" style={styles.center}>
            {banner}
          </Text>
        ) : null}
      </ScrollView>

      <Confetti active={confetti} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  levelRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  coins: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  checkinRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  flameWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  challengeRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  center: { textAlign: 'center' },
});
