import { useHistoryStore } from '../history.store';
import { usePremiumStore } from '../premium.store';

const sampleInput = {
  bmi: 22.9,
  category: 'normal' as const,
  weightKg: 70,
  heightCm: 175,
  age: 30,
  gender: 'male' as const,
  unit: 'metric' as const,
};

describe('history store', () => {
  beforeEach(() => {
    useHistoryStore.getState().clear();
    // Ensure unlimited history so limit logic doesn't interfere here.
    usePremiumStore.getState().setFlag('unlimitedHistory', true);
  });

  it('adds a record with id + timestamp at the front', () => {
    const rec = useHistoryStore.getState().add(sampleInput);
    expect(rec).not.toBeNull();
    expect(rec?.id).toBeTruthy();
    expect(rec?.createdAt).toBeGreaterThan(0);
    expect(useHistoryStore.getState().records).toHaveLength(1);
  });

  it('removes a record by id', () => {
    const rec = useHistoryStore.getState().add(sampleInput);
    useHistoryStore.getState().remove(rec!.id);
    expect(useHistoryStore.getState().records).toHaveLength(0);
  });

  it('clears all records', () => {
    useHistoryStore.getState().add(sampleInput);
    useHistoryStore.getState().add(sampleInput);
    useHistoryStore.getState().clear();
    expect(useHistoryStore.getState().records).toHaveLength(0);
  });
});

describe('history free-tier limit', () => {
  beforeEach(() => {
    useHistoryStore.getState().clear();
    usePremiumStore.getState().setFlag('unlimitedHistory', false);
  });

  it('stops adding past the free limit', () => {
    for (let i = 0; i < 25; i += 1) useHistoryStore.getState().add(sampleInput);
    expect(useHistoryStore.getState().records.length).toBeLessThanOrEqual(20);
    const overflow = useHistoryStore.getState().add(sampleInput);
    expect(overflow).toBeNull();
  });
});
