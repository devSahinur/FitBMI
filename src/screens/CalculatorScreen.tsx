import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Controller, useForm } from 'react-hook-form';
import { icons } from 'lucide-react-native';

import {
  ScreenContainer,
  SectionHeader,
  AnimatedCard,
  GlassCard,
  Button,
  Field,
  SegmentedControl,
  CircularProgress,
  Gauge,
  CategoryPill,
  AnimatedCounter,
  Confetti,
  Text,
} from '@/components';
import { useTheme } from '@/hooks/useTheme';
import { useHaptics } from '@/hooks/useHaptics';
import { calculateBMI } from '@/utils/bmi';
import { lbToKg, kgToLb, ftInToCm, cmToFtIn } from '@/utils/units';
import { CATEGORY_META } from '@/constants';
import type { BMIResult, Gender, UnitSystem } from '@/types';
import { useHistoryStore } from '@/store/history.store';
import { useProfileStore } from '@/store/profile.store';
import { useSettingsStore } from '@/store/settings.store';
import { useAchievementsStore } from '@/store/achievements.store';
import { getRecommendations } from '@/features/bmi/recommendations';

interface FormValues {
  age: string;
  height: string; // metric: cm, imperial: inches (we use ft+in fields below)
  heightFt: string;
  heightIn: string;
  weight: string; // metric kg, imperial lb
}

export function CalculatorScreen() {
  const { colors } = useTheme();
  const haptic = useHaptics();
  const unit = useSettingsStore((s) => s.unit);
  const setUnit = useSettingsStore((s) => s.setUnit);
  const addRecord = useHistoryStore((s) => s.add);
  const { profile, setProfile } = useProfileStore();
  const unlock = useAchievementsStore((s) => s.unlock);

  const [gender, setGender] = useState<Gender>(profile.gender);
  const [result, setResult] = useState<BMIResult | null>(null);
  const [celebrate, setCelebrate] = useState(false);

  const ftIn = cmToFtIn(profile.heightCm);
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      age: String(profile.age),
      height: String(profile.heightCm),
      heightFt: String(ftIn.ft),
      heightIn: String(ftIn.in),
      weight: String(
        unit === 'imperial'
          ? kgToLb(profile.currentWeightKg)
          : profile.currentWeightKg,
      ),
    },
  });

  const onCalculate = (values: FormValues) => {
    const heightCm =
      unit === 'imperial'
        ? ftInToCm(Number(values.heightFt) || 0, Number(values.heightIn) || 0)
        : Number(values.height) || 0;
    const weightKg =
      unit === 'imperial'
        ? lbToKg(Number(values.weight) || 0)
        : Number(values.weight) || 0;

    if (heightCm <= 0 || weightKg <= 0) {
      haptic('error');
      return;
    }

    const res = calculateBMI(weightKg, heightCm);
    setResult(res);
    haptic('success');

    // Persist as profile + history record
    setProfile({
      gender,
      age: Number(values.age) || profile.age,
      heightCm,
      currentWeightKg: weightKg,
    });
    addRecord({
      bmi: res.bmi,
      category: res.category,
      weightKg,
      heightCm,
      age: Number(values.age) || profile.age,
      gender,
      unit,
    });

    if (res.category === 'normal') {
      unlock('healthy-bmi');
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 2200);
    }
  };

  return (
    <ScreenContainer>
      <SectionHeader title="BMI Calculator" />

      {/* Unit toggle */}
      <SegmentedControl<UnitSystem>
        segments={[
          { label: 'Metric (kg/cm)', value: 'metric' },
          { label: 'Imperial (lb/ft)', value: 'imperial' },
        ]}
        value={unit}
        onChange={setUnit}
      />

      {/* Inputs */}
      <AnimatedCard index={0} style={{ gap: 16 }}>
        <Text variant="label" tone="muted">
          Gender
        </Text>
        <SegmentedControl<Gender>
          segments={[
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
            { label: 'Other', value: 'other' },
          ]}
          value={gender}
          onChange={setGender}
        />

        <Controller
          control={control}
          name="age"
          render={({ field: { value, onChange } }) => (
            <Field
              label="Age"
              keyboardType="number-pad"
              value={value}
              onChangeText={onChange}
              suffix="yrs"
            />
          )}
        />

        {unit === 'metric' ? (
          <Controller
            control={control}
            name="height"
            render={({ field: { value, onChange } }) => (
              <Field
                label="Height"
                keyboardType="decimal-pad"
                value={value}
                onChangeText={onChange}
                suffix="cm"
              />
            )}
          />
        ) : (
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Controller
                control={control}
                name="heightFt"
                render={({ field: { value, onChange } }) => (
                  <Field
                    label="Height"
                    keyboardType="number-pad"
                    value={value}
                    onChangeText={onChange}
                    suffix="ft"
                  />
                )}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Controller
                control={control}
                name="heightIn"
                render={({ field: { value, onChange } }) => (
                  <Field
                    label=" "
                    keyboardType="number-pad"
                    value={value}
                    onChangeText={onChange}
                    suffix="in"
                  />
                )}
              />
            </View>
          </View>
        )}

        <Controller
          control={control}
          name="weight"
          render={({ field: { value, onChange } }) => (
            <Field
              label="Weight"
              keyboardType="decimal-pad"
              value={value}
              onChangeText={onChange}
              suffix={unit === 'imperial' ? 'lb' : 'kg'}
            />
          )}
        />

        <Button title="Calculate BMI" onPress={handleSubmit(onCalculate)} />
      </AnimatedCard>

      {/* Result */}
      {result && (
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 450 }}
          style={{ gap: 16 }}
        >
          <GlassCard>
            <View style={styles.resultTop}>
              <CircularProgress
                progress={result.gaugeProgress}
                size={150}
                color={CATEGORY_META[result.category].color}
              >
                <AnimatedCounter value={result.bmi} decimals={1} variant="h1" />
                <Text variant="caption" tone="muted">
                  BMI
                </Text>
              </CircularProgress>
              <View style={{ flex: 1, gap: 8, alignItems: 'flex-start' }}>
                <CategoryPill category={result.category} />
                <Text variant="caption" tone="muted">
                  Healthy range
                </Text>
                <Text variant="title">
                  {result.healthyRange[0]}–{result.healthyRange[1]} kg
                </Text>
              </View>
            </View>

            <View style={{ alignItems: 'center', marginTop: 8 }}>
              <Gauge bmi={result.bmi} />
              <View style={styles.legend}>
                {(
                  ['underweight', 'normal', 'overweight', 'obese'] as const
                ).map((c) => (
                  <View key={c} style={styles.legendItem}>
                    <View
                      style={[
                        styles.legendDot,
                        { backgroundColor: CATEGORY_META[c].color },
                      ]}
                    />
                    <Text variant="caption" tone="muted">
                      {CATEGORY_META[c].label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </GlassCard>

          <SectionHeader title="Recommendations" />
          {getRecommendations(result.category).map((rec, i) => {
            const Icon =
              (icons as Record<string, React.ComponentType<{ size?: number; color?: string }>>)[
                toPascal(rec.icon)
              ] ?? icons.Info;
            return (
              <AnimatedCard key={rec.title} index={i} style={styles.recRow}>
                <View
                  style={[
                    styles.recIcon,
                    { backgroundColor: `${colors.primary}1A` },
                  ]}
                >
                  <Icon size={20} color={colors.primary} />
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text variant="title">{rec.title}</Text>
                  <Text variant="caption" tone="muted">
                    {rec.body}
                  </Text>
                </View>
              </AnimatedCard>
            );
          })}
        </MotiView>
      )}

      <Confetti active={celebrate} />
    </ScreenContainer>
  );
}

function toPascal(kebab: string): string {
  return kebab
    .split('-')
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join('');
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12 },
  resultTop: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginTop: 8,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  recRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  recIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
