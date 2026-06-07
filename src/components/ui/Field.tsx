import React, { memo } from 'react';
import { View, TextInput, StyleSheet, type TextInputProps } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { radius } from '@/theme';
import { Text } from './Text';

interface FieldProps extends TextInputProps {
  label?: string;
  error?: string;
  suffix?: string;
}

/** Labelled text input with error state, used with React Hook Form. */
function FieldComponent({ label, error, suffix, style, ...rest }: FieldProps) {
  const { colors } = useTheme();
  return (
    <View style={{ gap: 6 }}>
      {label ? (
        <Text variant="label" tone="muted">
          {label}
        </Text>
      ) : null}
      <View
        style={[
          styles.inputWrap,
          {
            backgroundColor: colors.surfaceAlt,
            borderColor: error ? colors.secondary : 'transparent',
          },
        ]}
      >
        <TextInput
          placeholderTextColor={colors.textMuted}
          style={[styles.input, { color: colors.text }, style]}
          {...rest}
        />
        {suffix ? (
          <Text variant="label" tone="muted">
            {suffix}
          </Text>
        ) : null}
      </View>
      {error ? (
        <Text variant="caption" style={{ color: colors.secondary }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1.5,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    height: 52,
    fontSize: 16,
  },
});

export const Field = memo(FieldComponent);
