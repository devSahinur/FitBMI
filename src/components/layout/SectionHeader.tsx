import React, { memo } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/Text';

interface SectionHeaderProps {
  title: string;
  action?: { label: string; onPress: () => void };
}

function SectionHeaderComponent({ title, action }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <Text variant="h3" accessibilityRole="header">
        {title}
      </Text>
      {action && (
        <Pressable
          accessibilityRole="button"
          hitSlop={8}
          onPress={action.onPress}
        >
          <Text variant="label" tone="primary">
            {action.label}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export const SectionHeader = memo(SectionHeaderComponent);
