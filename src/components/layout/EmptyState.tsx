import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { icons } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/useTheme';

interface EmptyStateProps {
  icon?: keyof typeof icons;
  title: string;
  message?: string;
}

function EmptyStateComponent({
  icon = 'Inbox',
  title,
  message,
}: EmptyStateProps) {
  const { colors } = useTheme();
  const Icon = icons[icon] ?? icons.Inbox;
  return (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'timing', duration: 400 }}
      style={styles.wrap}
    >
      <View style={[styles.circle, { backgroundColor: colors.surfaceAlt }]}>
        <Icon size={32} color={colors.textMuted} />
      </View>
      <Text variant="title" style={styles.title}>
        {title}
      </Text>
      {message && (
        <Text variant="caption" tone="muted" style={styles.msg}>
          {message}
        </Text>
      )}
    </MotiView>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: 48, gap: 8 },
  circle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: { textAlign: 'center' },
  msg: { textAlign: 'center', maxWidth: 260 },
});

export const EmptyState = memo(EmptyStateComponent);
