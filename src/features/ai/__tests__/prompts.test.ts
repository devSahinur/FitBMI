import {
  systemPrompt,
  contextLine,
  insightsPrompt,
  workoutPrompt,
  recipePrompt,
  goalPlanPrompt,
  HEALTH_DISCLAIMER,
} from '../prompts';
import type { AIUserContext } from '../types';

const ctx: AIUserContext = {
  name: 'Alex',
  age: 30,
  gender: 'male',
  heightCm: 175,
  weightKg: 70,
  targetWeightKg: 68,
  bmi: 22.9,
  bmiCategory: 'normal',
  unit: 'metric',
};

describe('ai prompts', () => {
  it('contextLine includes key profile facts', () => {
    const line = contextLine(ctx);
    expect(line).toContain('Alex');
    expect(line).toContain('22.9');
    expect(line).toContain('Normal');
  });

  it('systemPrompt embeds the disclaimer and profile', () => {
    const p = systemPrompt(ctx);
    expect(p).toContain(HEALTH_DISCLAIMER);
    expect(p).toContain('Alex');
  });

  it('insightsPrompt asks for a JSON array of 4', () => {
    const p = insightsPrompt(ctx);
    expect(p).toMatch(/JSON array/i);
    expect(p).toContain('4');
  });

  it('workoutPrompt requests sets/reps/rest/calories', () => {
    const p = workoutPrompt(ctx, 'beginner');
    expect(p).toMatch(/sets/i);
    expect(p).toMatch(/reps/i);
    expect(p).toMatch(/rest/i);
    expect(p).toMatch(/calories/i);
  });

  it('recipePrompt requests macros', () => {
    const p = recipePrompt(ctx, 'salad');
    expect(p).toMatch(/protein/i);
    expect(p).toMatch(/carbohydrates/i);
  });

  it('goalPlanPrompt reflects the duration', () => {
    expect(goalPlanPrompt(ctx, 'lose-weight', 30)).toContain('30-day');
  });
});
