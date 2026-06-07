import { useMemo } from 'react';
import { useProfileStore } from '@/store/profile.store';
import { useSettingsStore } from '@/store/settings.store';
import { calculateBMI } from '@/utils/bmi';
import type { AIUserContext } from '@/features/ai/types';

/** Builds the AI grounding context from the user's profile + settings. */
export function useAIContext(): AIUserContext {
  const { profile } = useProfileStore();
  const unit = useSettingsStore((s) => s.unit);

  return useMemo(() => {
    const { bmi, category } = calculateBMI(
      profile.currentWeightKg,
      profile.heightCm,
    );
    return {
      name: profile.name,
      age: profile.age,
      gender: profile.gender,
      heightCm: profile.heightCm,
      weightKg: profile.currentWeightKg,
      targetWeightKg: profile.targetWeightKg,
      bmi,
      bmiCategory: category,
      unit,
    };
  }, [profile, unit]);
}
