import React, { memo } from 'react';
import { View, Pressable, Switch, StyleSheet } from 'react-native';
import { icons, ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { palette, radius } from '@/theme';
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
  /** Greys the row, shows a "Soon" badge and ignores presses. */
  disabled?: boolean;
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
  disabled = false,
}: SettingRowProps) {
  const { colors } = useTheme();
  const Icon = icon ? (icons[icon] ?? icons.Settings) : null;
  const isSwitch = typeof value === 'boolean';

  return (
    <Pressable
      accessibilityRole={isSwitch ? 'switch' : 'button'}
      accessibilityState={
        disabled
          ? { disabled: true }
          : isSwitch
            ? { checked: value }
            : undefined
      }
      disabled={disabled}
      onPress={() => {
        if (disabled) return;
        if (isSwitch) onValueChange?.(!value);
        else onPress?.();
      }}
      style={[styles.row, { opacity: disabled ? 0.5 : 1 }]}
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
      {disabled ? (
        <View style={[styles.soon, { backgroundColor: colors.surfaceAlt }]}>
          <Text variant="label" tone="muted">
            Soon
          </Text>
        </View>
      ) : isSwitch ? (
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
  soon: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
});

export const SettingRow = memo(SettingRowComponent);
