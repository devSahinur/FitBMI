import React, { useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';

import {
  ScreenContainer,
  SectionHeader,
  AnimatedCard,
  GlassCard,
  Avatar,
  Badge,
  Button,
  Chip,
  Field,
  CategoryPill,
  SettingRow,
  SegmentedControl,
  Sheet,
  type SheetRef,
  Text,
} from '@/components';
import { THEME_VARIANT_LIST } from '@/theme/variants';
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
import { kgToLb, lbToKg, cmToFtIn, ftInToCm } from '@/utils/units';
import { calculateBMI } from '@/utils/bmi';
import type { BMICategory, Gender, ThemeMode, UnitSystem } from '@/types';

export function ProfileScreen() {
  const haptic = useHaptics();
  const router = useRouter();
  const editRef = useRef<SheetRef>(null);
  const langRef = useRef<SheetRef>(null);

  const { profile, goals, setProfile, setGoals } = useProfileStore();
  const settings = useSettingsStore();
  const unlocked = useAchievementsStore((s) => s.unlocked);
  const premium = usePremiumStore();
  const records = useHistoryStore((s) => s.records);

  const imperial = settings.unit === 'imperial';
  const weightUnit = imperial ? 'lb' : 'kg';

  const buildDraft = () => {
    const { ft, in: inch } = cmToFtIn(profile.heightCm);
    return {
      name: profile.name === 'Guest' ? '' : profile.name,
      gender: profile.gender,
      age: String(profile.age),
      heightCm: String(Math.round(profile.heightCm)),
      heightFt: String(ft),
      heightIn: String(inch),
      weight: String(
        imperial ? kgToLb(profile.currentWeightKg) : profile.currentWeightKg,
      ),
      target: String(
        imperial ? kgToLb(profile.targetWeightKg) : profile.targetWeightKg,
      ),
    };
  };

  const [draft, setDraft] = useState(buildDraft);
  const set = (key: keyof ReturnType<typeof buildDraft>, value: string) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const openEdit = () => {
    setDraft(buildDraft());
    editRef.current?.present();
  };

  // Live BMI preview from the values currently in the form.
  const draftHeightCm = imperial
    ? ftInToCm(Number(draft.heightFt) || 0, Number(draft.heightIn) || 0)
    : Number(draft.heightCm) || 0;
  const draftWeightKg = imperial
    ? lbToKg(Number(draft.weight) || 0)
    : Number(draft.weight) || 0;
  const preview =
    draftHeightCm > 0 && draftWeightKg > 0
      ? calculateBMI(draftWeightKg, draftHeightCm)
      : null;

  const saveProfile = () => {
    const heightCm = draftHeightCm > 0 ? draftHeightCm : profile.heightCm;
    const currentWeightKg =
      draftWeightKg > 0 ? draftWeightKg : profile.currentWeightKg;
    const targetWeightKg = imperial
      ? lbToKg(Number(draft.target) || 0) || profile.targetWeightKg
      : Number(draft.target) || profile.targetWeightKg;

    setProfile({
      name: draft.name.trim() || 'Guest',
      gender: draft.gender,
      age: Number(draft.age) || profile.age,
      heightCm,
      currentWeightKg,
      targetWeightKg,
    });
    setGoals({ targetWeightKg: targetWeightKg || goals.targetWeightKg });
    haptic('success');
    editRef.current?.dismiss();
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
    <View style={styles.fill}>
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

        <SectionHeader title="Style" />
        <View style={styles.variantChips}>
          {THEME_VARIANT_LIST.map((v) => (
            <Chip
              key={v.key}
              label={v.name}
              active={settings.themeVariant === v.key}
              onPress={() => settings.setThemeVariant(v.key)}
            />
          ))}
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
          onPress={() => langRef.current?.present()}
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
        <SettingRow
          icon="MessagesSquare"
          label="Unlimited AI chats"
          value={premium.flags.unlimitedAiChats}
          onValueChange={(v) => premium.setFlag('unlimitedAiChats', v)}
        />
        <SettingRow
          icon="FileDown"
          label="Export PDF reports"
          value={premium.flags.exportPdf}
          onValueChange={(v) => premium.setFlag('exportPdf', v)}
        />
      </GlassCard>

      {/* More — coming in a future release */}
      <GlassCard>
        <SectionHeader title="More" />
        <Text variant="caption" tone="muted" style={{ marginBottom: 4 }}>
          These features are on the way — coming in a future update.
        </Text>
        <SettingRow icon="LogIn" label="Account / Sign in" disabled />
        <SettingRow icon="Crown" label="Go Premium" disabled />
        <SettingRow icon="Gift" label="Rewards & Streaks" disabled />
        <SettingRow icon="LayoutDashboard" label="Health Dashboard" disabled />
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
      </ScreenContainer>

      {/* Edit sheet — professional form (modal portal, scrollable). */}
      <Sheet ref={editRef} snapPoints={['90%']} scrollable>
        {/* Header */}
        <View style={styles.sheetHeader}>
          <Avatar uri={profile.avatarUri} name={draft.name || 'You'} size={60} />
          <View style={{ flex: 1 }}>
            <Text variant="h3">Edit profile</Text>
            <Text variant="caption" tone="muted">
              Keep your stats current for accurate BMI & insights.
            </Text>
          </View>
        </View>

        {/* Live BMI preview */}
        {preview && (
          <View style={[styles.previewCard, { backgroundColor: colorsForPreview(preview.category) }]}>
            <View>
              <Text variant="label" tone="muted">
                Live BMI
              </Text>
              <Text variant="h2">{preview.bmi}</Text>
            </View>
            <CategoryPill category={preview.category} />
          </View>
        )}

        <Field
          bottomSheet
          label="Full name"
          placeholder="Your name"
          value={draft.name}
          onChangeText={(v) => set('name', v)}
        />

        <View style={{ gap: 8 }}>
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
        </View>

        <View style={styles.row2}>
          <View style={{ flex: 1 }}>
            <Field
          bottomSheet
              label="Age"
              keyboardType="number-pad"
              value={draft.age}
              onChangeText={(v) => set('age', v)}
              suffix="yrs"
            />
          </View>
          {imperial ? (
            <View style={[styles.row2, { flex: 1.4 }]}>
              <View style={{ flex: 1 }}>
                <Field
          bottomSheet
                  label="Height"
                  keyboardType="number-pad"
                  value={draft.heightFt}
                  onChangeText={(v) => set('heightFt', v)}
                  suffix="ft"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Field
          bottomSheet
                  label=" "
                  keyboardType="number-pad"
                  value={draft.heightIn}
                  onChangeText={(v) => set('heightIn', v)}
                  suffix="in"
                />
              </View>
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <Field
          bottomSheet
                label="Height"
                keyboardType="decimal-pad"
                value={draft.heightCm}
                onChangeText={(v) => set('heightCm', v)}
                suffix="cm"
              />
            </View>
          )}
        </View>

        <View style={styles.row2}>
          <View style={{ flex: 1 }}>
            <Field
          bottomSheet
              label="Current weight"
              keyboardType="decimal-pad"
              value={draft.weight}
              onChangeText={(v) => set('weight', v)}
              suffix={weightUnit}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Field
          bottomSheet
              label="Target weight"
              keyboardType="decimal-pad"
              value={draft.target}
              onChangeText={(v) => set('target', v)}
              suffix={weightUnit}
            />
          </View>
        </View>

        <View style={styles.sheetActions}>
          <Button
            title="Cancel"
            variant="ghost"
            fullWidth={false}
            onPress={() => editRef.current?.dismiss()}
            style={{ flex: 1 }}
          />
          <Button
            title="Save changes"
            fullWidth={false}
            onPress={saveProfile}
            style={{ flex: 1 }}
          />
        </View>
      </Sheet>

      {/* Language selector */}
      <Sheet ref={langRef} snapPoints={['60%']} scrollable>
        <Text variant="h3">Select language</Text>
        <Text variant="caption" tone="muted">
          Choose your preferred language.
        </Text>
        <View style={{ marginTop: 4 }}>
          {SUPPORTED_LANGUAGES.map((l) => {
            const selected = settings.language === l.code;
            return (
              <Pressable
                key={l.code}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => {
                  haptic('light');
                  settings.setLanguage(l.code);
                  langRef.current?.dismiss();
                }}
                style={[styles.langRow, selected && styles.langRowActive]}
              >
                <Text variant="title">{l.label}</Text>
                {selected ? <Check size={20} color="#00C897" /> : null}
              </Pressable>
            );
          })}
        </View>
      </Sheet>
    </View>
  );
}

/** Soft tint behind the live BMI preview card. */
function colorsForPreview(category: BMICategory): string {
  const map: Record<BMICategory, string> = {
    underweight: 'rgba(0,168,255,0.12)',
    normal: 'rgba(0,200,151,0.12)',
    overweight: 'rgba(255,176,32,0.12)',
    obese: 'rgba(255,92,92,0.12)',
  };
  return map[category];
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  badges: { gap: 12, paddingVertical: 4, paddingRight: 8 },
  variantChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 8,
  },
  disclaimer: { textAlign: 'center', paddingHorizontal: 24, marginTop: 8 },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  row2: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  sheetActions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  langRowActive: { backgroundColor: 'rgba(0,200,151,0.10)' },
});
