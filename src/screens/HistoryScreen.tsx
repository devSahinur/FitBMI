import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Pressable, Alert } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, Trash2, Share2, FileDown } from 'lucide-react-native';

import {
  GlassCard,
  Field,
  Chip,
  Button,
  CategoryPill,
  EmptyState,
  SectionHeader,
  Text,
} from '@/components';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { useTheme } from '@/hooks/useTheme';
import { palette } from '@/theme';
import { useHaptics } from '@/hooks/useHaptics';
import { useHistoryStore } from '@/store/history.store';
import { useSettingsStore } from '@/store/settings.store';
import { ExportService } from '@/services/export.service';
import { recordToShareText } from '@/utils/csv';
import { relativeDate } from '@/utils/date';
import { formatWeight } from '@/utils/format';
import { CATEGORY_META } from '@/constants';
import type { BMICategory, BMIRecord } from '@/types';

type Filter = 'all' | BMICategory;

export function HistoryScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const haptic = useHaptics();
  const records = useHistoryStore((s) => s.records);
  const remove = useHistoryStore((s) => s.remove);
  const clear = useHistoryStore((s) => s.clear);
  const unit = useSettingsStore((s) => s.unit);

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = useMemo(() => {
    return records.filter((r) => {
      const matchesFilter = filter === 'all' || r.category === filter;
      const matchesQuery =
        query.trim() === '' ||
        CATEGORY_META[r.category].label
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        String(r.bmi).includes(query);
      return matchesFilter && matchesQuery;
    });
  }, [records, filter, query]);

  const confirmDelete = (id: string) => {
    haptic('warning');
    Alert.alert('Delete record', 'Remove this BMI record?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => remove(id) },
    ]);
  };

  const onExport = async () => {
    if (records.length === 0) return;
    haptic('medium');
    await ExportService.exportCSV(records).catch(() => undefined);
  };

  const onShare = async (record: BMIRecord) => {
    haptic('light');
    await ExportService.shareText(recordToShareText(record)).catch(
      () => undefined,
    );
  };

  const filters: { label: string; value: Filter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Underweight', value: 'underweight' },
    { label: 'Normal', value: 'normal' },
    { label: 'Overweight', value: 'overweight' },
    { label: 'Obese', value: 'obese' },
  ];

  const renderItem = ({ item }: { item: BMIRecord }) => (
    <GlassCard style={styles.item}>
      <View style={styles.itemRow}>
        <View
          style={[
            styles.bmiBadge,
            { backgroundColor: `${CATEGORY_META[item.category].color}22` },
          ]}
        >
          <Text
            variant="h3"
            style={{ color: CATEGORY_META[item.category].color }}
          >
            {item.bmi}
          </Text>
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          <CategoryPill category={item.category} size="sm" />
          <Text variant="caption" tone="muted">
            {formatWeight(item.weightKg, unit)} ·{' '}
            {relativeDate(item.createdAt)}
          </Text>
        </View>
        <View style={styles.actions}>
          <Pressable
            hitSlop={8}
            onPress={() => onShare(item)}
            accessibilityLabel="Share record"
          >
            <Share2 size={20} color={colors.textMuted} />
          </Pressable>
          <Pressable
            hitSlop={8}
            onPress={() => confirmDelete(item.id)}
            accessibilityLabel="Delete record"
          >
            <Trash2 size={20} color={palette.obese} />
          </Pressable>
        </View>
      </View>
    </GlassCard>
  );

  return (
    <ScreenContainer scroll={false}>
      <View style={{ gap: 12, flex: 1 }}>
        <View style={styles.headerRow}>
          <SectionHeader title="History" />
          {records.length > 0 && (
            <Pressable
              hitSlop={8}
              onPress={() =>
                Alert.alert('Clear all', 'Delete all history?', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Clear', style: 'destructive', onPress: clear },
                ])
              }
            >
              <Text variant="label" tone="muted">
                Clear all
              </Text>
            </Pressable>
          )}
        </View>

        <Field
          placeholder="Search by category or BMI…"
          value={query}
          onChangeText={setQuery}
          // eslint-disable-next-line react-native/no-inline-styles
          style={{ paddingLeft: 4 }}
          autoCapitalize="none"
        />
        <View style={styles.searchIcon}>
          <Search size={16} color={colors.textMuted} />
        </View>

        <View style={styles.chips}>
          {filters.map((f) => (
            <Chip
              key={f.value}
              label={f.label}
              active={filter === f.value}
              color={
                f.value === 'all'
                  ? colors.primary
                  : CATEGORY_META[f.value].color
              }
              onPress={() => setFilter(f.value)}
            />
          ))}
        </View>

        {filtered.length === 0 ? (
          <EmptyState
            icon="History"
            title="No records yet"
            message="Calculate your BMI to start building your history."
          />
        ) : (
          <FlashList
            data={filtered}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            contentContainerStyle={{ paddingBottom: insets.bottom + 160 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {records.length > 0 && (
        <View style={[styles.exportBar, { bottom: insets.bottom + 80 }]}>
          <Button
            title="Export CSV"
            variant="ghost"
            icon={<FileDown size={18} color={colors.primary} />}
            onPress={onExport}
          />
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchIcon: { position: 'absolute', right: 32, top: 58 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  item: { paddingVertical: 12 },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bmiBadge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  exportBar: { position: 'absolute', left: 16, right: 16 },
});
