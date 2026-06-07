import React, { memo } from 'react';
import { Text as RNText, type TextProps } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { typography, type TextVariant } from '@/theme/typography';

type Tone =
  | 'default'
  | 'muted'
  | 'primary'
  | 'inverse'
  | 'success'
  | 'warning'
  | 'error';

interface AppTextProps extends TextProps {
  variant?: TextVariant;
  tone?: Tone;
}

/** Theme-aware typography primitive (Poppins/Inter) with accessible defaults. */
function AppTextComponent({
  variant = 'body',
  tone = 'default',
  style,
  ...rest
}: AppTextProps) {
  const { colors } = useTheme();
  const color =
    tone === 'muted'
      ? colors.textMuted
      : tone === 'primary'
        ? colors.primary
        : tone === 'inverse'
          ? colors.textInverse
          : tone === 'success'
            ? colors.success
            : tone === 'warning'
              ? colors.warning
              : tone === 'error'
                ? colors.error
                : colors.text;

  return (
    <RNText
      maxFontSizeMultiplier={1.6}
      style={[typography[variant], { color }, style]}
      {...rest}
    />
  );
}

export const Text = memo(AppTextComponent);
