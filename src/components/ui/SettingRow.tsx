import React, { memo } from 'react';
import { View, Pressable, Switch, StyleSheet } from 'react-native';
import { icons, ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { palette } from '@/theme';
import { Text } from './Text';

interface SettingRowProps {
  icon?: keyof typeof icons;
  label: string;
  description?: string;
  /** Render a trailing switch. */
  value?: boolean;
  onValueChange?: (v: boolean) => void;
  onPress?: () => void;
  rightText?: string;
}

/** Reusable row for the Profile/Settings screens (toggle or navigation). */
function SettingRowComponent({
  icon,
  label,
  description,
  value,
  onValueChange,
  onPress,
  rightText,
}: SettingRowProps) {
  const { colors } = useTheme();
  const Icon = icon ? (icons[icon] ?? icons.Settings) : null;
  const isSwitch = typeof value === 'boolean';

  return (
    <Pressable
      accessibilityRole={isSwitch ? 'switch' : 'button'}
      accessibilityState={isSwitch ? { checked: value } : undefined}
      onPress={() => {
        if (isSwitch) onValueChange?.(!value);
        else onPress?.();
      }}
      style={styles.row}
    >
      {Icon ? (
        <View style={[styles.iconWrap, { backgroundColor: colors.surfaceAlt }]}>
          <Icon size={18} color={colors.primary} />
        </View>
      ) : null}
      <View style={styles.labelCol}>
        <Text variant="body">{label}</Text>
        {description ? (
          <Text variant="caption" tone="muted">
            {description}
          </Text>
        ) : null}
      </View>
      {isSwitch ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ true: palette.primary, false: colors.border }}
          thumbColor="#fff"
        />
      ) : rightText ? (
        <Text variant="label" tone="muted">
          {rightText}
        </Text>
      ) : (
        <ChevronRight size={20} color={colors.textMuted} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelCol: { flex: 1, gap: 2 },
});

export const SettingRow = memo(SettingRowComponent);
