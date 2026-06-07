import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { CATEGORY_META } from '@/constants';
import { radius } from '@/theme';
import type { BMICategory } from '@/types';
import { Text } from './Text';

interface CategoryPillProps {
  category: BMICategory;
  size?: 'sm' | 'md';
}

/** Colored pill showing a BMI classification label. */
function CategoryPillComponent({ category, size = 'md' }: CategoryPillProps) {
  const meta = CATEGORY_META[category];
  const small = size === 'sm';
  return (
    <View
      style={[
        styles.pill,
        {
          backgroundColor: `${meta.color}22`,
          paddingVertical: small ? 4 : 6,
          paddingHorizontal: small ? 10 : 14,
        },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: meta.color }]} />
      <Text
        variant={small ? 'caption' : 'label'}
        style={{ color: meta.color }}
      >
        {meta.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
});

export const CategoryPill = memo(CategoryPillComponent);
