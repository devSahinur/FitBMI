import React, { memo } from 'react';
import { Text as RNText, type TextProps } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

type Variant = 'h1' | 'h2' | 'h3' | 'title' | 'body' | 'caption' | 'label';
type Tone = 'default' | 'muted' | 'primary' | 'inverse';

interface AppTextProps extends TextProps {
  variant?: Variant;
  tone?: Tone;
}

const SIZES: Record<Variant, { fontSize: number; fontWeight: '400' | '500' | '600' | '700' }> = {
  h1: { fontSize: 32, fontWeight: '700' },
  h2: { fontSize: 24, fontWeight: '700' },
  h3: { fontSize: 20, fontWeight: '600' },
  title: { fontSize: 18, fontWeight: '600' },
  body: { fontSize: 15, fontWeight: '400' },
  caption: { fontSize: 13, fontWeight: '400' },
  label: { fontSize: 12, fontWeight: '500' },
};

/** Theme-aware typography primitive with accessible defaults. */
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
          : colors.text;

  return (
    <RNText
      maxFontSizeMultiplier={1.6}
      style={[SIZES[variant], { color }, style]}
      {...rest}
    />
  );
}

export const Text = memo(AppTextComponent);
