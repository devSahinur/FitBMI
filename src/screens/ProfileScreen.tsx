import React, { useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import type BottomSheet from '@gorhom/bottom-sheet';

import {
  ScreenContainer,
  SectionHeader,
  AnimatedCard,
  GlassCard,
  Avatar,
  Badge,
  Button,
  Field,
  SettingRow,
  SegmentedControl,
  Sheet,
  Text,
} from '@/components';
import { useHaptics } from '@/hooks/useHaptics';
import { useProfileStore } from '@/store/profile.store';
import { useSettingsStore } from '@/store/settings.store';
import { useAchievementsStore } from '@/store/achievements.store';
import { usePremiumStore } from '@/store/premium.store';
import { useHistoryStore } from '@/store/history.store';
import { NotificationService } from '@/services/notifications.service';
import { ExportService } from '@/services/export.service';
import { ACHIEVEMENTS, DISCLAIMER, SUPPORTED_LANGUAGES } from '@/constants';
import { formatHeight, formatWeight } from '@/utils/format';
import type { Gender, ThemeMode, UnitSystem } from '@/types';

export function ProfileScreen() {
  const haptic = useHaptics();
  const router = useRouter();
  const editRef = useRef<BottomSheet>(null);

  const { profile, goals, setProfile, setGoals } = useProfileStore();
  const settings = useSettingsStore();
  const unlocked = useAchievementsStore((s) => s.unlocked);
  const premium = usePremiumStore();
  const records = useHistoryStore((s) => s.records);

  const [draft, setDraft] = useState({
    name: profile.name,
    age: String(profile.age),
    gender: profile.gender,
    target: String(profile.targetWeightKg),
  });

  const openEdit = () => {
    setDraft({
      name: profile.name,
      age: String(profile.age),
      gender: profile.gender,
      target: String(profile.targetWeightKg),
    });
    editRef.current?.expand();
  };

  const saveProfile = () => {
    setProfile({
      name: draft.name.trim() || 'Guest',
      age: Number(draft.age) || profile.age,
      gender: draft.gender,
      targetWeightKg: Number(draft.target) || profile.targetWeightKg,
    });
    setGoals({ targetWeightKg: Number(draft.target) || goals.targetWeightKg });
    haptic('success');
    editRef.current?.close();
  };

  const toggleNotifications = async (enabled: boolean) => {
    settings.setNotification('enabled', enabled);
    await NotificationService.sync({ ...settings.notifications, enabled }).catch(
      () => undefined,
    );
  };

  const syncReminder = async (
    key: keyof typeof settings.notifications,
    value: boolean,
  ) => {
    settings.setNotification(key, value);
    await NotificationService.sync({
      ...settings.notifications,
      [key]: value,
    }).catch(() => undefined);
  };

  const backup = async () => {
    haptic('medium');
    if (records.length === 0) {
      Alert.alert('Nothing to back up', 'Add some records first.');
      return;
    }
    await ExportService.exportReport(records).catch(() => undefined);
  };

  return (
    <ScreenContainer>
      <SectionHeader title="Profile" />

      {/* Profile card */}
      <AnimatedCard index={0}>
        <View style={styles.profileRow}>
          <Avatar uri={profile.avatarUri} name={profile.name} size={72} />
          <View style={{ flex: 1, gap: 2 }}>
            <Text variant="h3">{profile.name}</Text>
            <Text variant="caption" tone="muted">
              {profile.gender} · {profile.age} yrs
            </Text>
            <Text variant="caption" tone="muted">
              {formatHeight(profile.heightCm, settings.unit)} ·{' '}
              {formatWeight(profile.currentWeightKg, settings.unit)}
            </Text>
          </View>
        </View>
        <Button title="Edit profile" variant="ghost" onPress={openEdit} />
      </AnimatedCard>

      {/* Achievements */}
      <SectionHeader title="Achievements" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.badges}
      >
        {ACHIEVEMENTS.map((a, i) => (
          <Badge
            key={a.id}
            title={a.title}
            description={a.description}
            icon={a.icon}
            unlocked={Boolean(unlocked[a.id])}
            index={i}
          />
        ))}
      </ScrollView>

      {/* Preferences */}
      <GlassCard>
        <SectionHeader title="Units" />
        <View style={{ marginVertical: 8 }}>
          <SegmentedControl<UnitSystem>
            segments={[
              { label: 'Metric', value: 'metric' },
              { label: 'Imperial', value: 'imperial' },
            ]}
            value={settings.unit}
            onChange={settings.setUnit}
          />
        </View>

        <SectionHeader title="Theme" />
        <View style={{ marginVertical: 8 }}>
          <SegmentedControl<ThemeMode>
            segments={[
              { label: 'Light', value: 'light' },
              { label: 'Dark', value: 'dark' },
              { label: 'System', value: 'system' },
            ]}
            value={settings.themeMode}
            onChange={settings.setThemeMode}
          />
        </View>

        <SettingRow
          icon="Vibrate"
          label="Haptic feedback"
          value={settings.haptics}
          onValueChange={settings.toggleHaptics}
        />
        <SettingRow
          icon="Languages"
          label="Language"
          rightText={
            SUPPORTED_LANGUAGES.find((l) => l.code === settings.language)
              ?.label ?? 'English'
          }
          onPress={() => cycleLanguage(settings)}
        />
      </GlassCard>

      {/* Notifications */}
      <GlassCard>
        <SectionHeader title="Notifications" />
        <SettingRow
          icon="Bell"
          label="Enable reminders"
          value={settings.notifications.enabled}
          onValueChange={toggleNotifications}
        />
        <SettingRow
          icon="Droplets"
          label="Drink water"
          value={settings.notifications.drinkWater}
          onValueChange={(v) => syncReminder('drinkWater', v)}
        />
        <SettingRow
          icon="Scale"
          label="Measure weight"
          value={settings.notifications.measureWeight}
          onValueChange={(v) => syncReminder('measureWeight', v)}
        />
        <SettingRow
          icon="Moon"
          label="Sleep reminder"
          value={settings.notifications.sleepReminder}
          onValueChange={(v) => syncReminder('sleepReminder', v)}
        />
        <SettingRow
          icon="Sun"
          label="Morning motivation"
          value={settings.notifications.morningMotivation}
          onValueChange={(v) => syncReminder('morningMotivation', v)}
        />
      </GlassCard>

      {/* Premium */}
      <GlassCard>
        <SectionHeader title="Premium" />
        <Text variant="caption" tone="muted" style={{ marginBottom: 4 }}>
          {premium.isActive()
            ? 'Premium features enabled.'
            : 'Unlock more with FitBMI Premium.'}
        </Text>
        <SettingRow
          icon="BadgeCheck"
          label="Remove ads"
          value={premium.flags.removeAds}
          onValueChange={(v) => premium.setFlag('removeAds', v)}
        />
        <SettingRow
          icon="Infinity"
          label="Unlimited history"
          value={premium.flags.unlimitedHistory}
          onValueChange={(v) => premium.setFlag('unlimitedHistory', v)}
        />
        <SettingRow
          icon="TrendingUp"
          label="Advanced analytics"
          value={premium.flags.advancedAnalytics}
          onValueChange={(v) => premium.setFlag('advancedAnalytics', v)}
        />
      </GlassCard>

      {/* Data & about */}
      <GlassCard>
        <SectionHeader title="Data & About" />
        <SettingRow icon="Download" label="Backup data" onPress={backup} />
        <SettingRow
          icon="ShieldCheck"
          label="Privacy Policy"
          onPress={() => router.push('/privacy')}
        />
        <SettingRow
          icon="FileText"
          label="Terms & Conditions"
          onPress={() => router.push('/terms')}
        />
        <SettingRow
          icon="Info"
          label="About FitBMI"
          onPress={() => router.push('/about')}
        />
      </GlassCard>

      <Text variant="caption" tone="muted" style={styles.disclaimer}>
        {DISCLAIMER}
      </Text>

      {/* Edit sheet */}
      <Sheet ref={editRef} snapPoints={['65%']}>
        <Text variant="h3">Edit profile</Text>
        <Field
          label="Name"
          value={draft.name}
          onChangeText={(v) => setDraft((d) => ({ ...d, name: v }))}
        />
        <Field
          label="Age"
          keyboardType="number-pad"
          value={draft.age}
          onChangeText={(v) => setDraft((d) => ({ ...d, age: v }))}
        />
        <Text variant="label" tone="muted">
          Gender
        </Text>
        <SegmentedControl<Gender>
          segments={[
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
            { label: 'Other', value: 'other' },
          ]}
          value={draft.gender}
          onChange={(g) => setDraft((d) => ({ ...d, gender: g }))}
        />
        <Field
          label="Target weight (kg)"
          keyboardType="decimal-pad"
          value={draft.target}
          onChangeText={(v) => setDraft((d) => ({ ...d, target: v }))}
        />
        <Button title="Save" onPress={saveProfile} />
      </Sheet>

      {/* spacer */}
      <View style={{ height: 4 }} />
    </ScreenContainer>
  );
}

function cycleLanguage(settings: ReturnType<typeof useSettingsStore.getState>) {
  const idx = SUPPORTED_LANGUAGES.findIndex((l) => l.code === settings.language);
  const next = SUPPORTED_LANGUAGES[(idx + 1) % SUPPORTED_LANGUAGES.length]!;
  settings.setLanguage(next.code);
}

const styles = StyleSheet.create({
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  badges: { gap: 12, paddingVertical: 4, paddingRight: 8 },
  disclaimer: { textAlign: 'center', paddingHorizontal: 24, marginTop: 8 },
});
