/**
 * Typography system. Headings use Poppins, body/labels use Inter (Google
 * Fonts, free for commercial use). Font families resolve to the names used by
 * @expo-google-fonts and loaded in the root layout.
 */
export const fonts = {
  poppinsSemiBold: 'Poppins_600SemiBold',
  poppinsBold: 'Poppins_700Bold',
  interRegular: 'Inter_400Regular',
  interMedium: 'Inter_500Medium',
  interSemiBold: 'Inter_600SemiBold',
} as const;

export type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'title'
  | 'body'
  | 'caption'
  | 'label';

interface VariantStyle {
  fontSize: number;
  lineHeight: number;
  fontFamily: string;
}

export const typography: Record<TextVariant, VariantStyle> = {
  h1: { fontSize: 32, lineHeight: 38, fontFamily: fonts.poppinsBold },
  h2: { fontSize: 24, lineHeight: 30, fontFamily: fonts.poppinsBold },
  h3: { fontSize: 20, lineHeight: 26, fontFamily: fonts.poppinsSemiBold },
  title: { fontSize: 17, lineHeight: 23, fontFamily: fonts.poppinsSemiBold },
  body: { fontSize: 15, lineHeight: 22, fontFamily: fonts.interRegular },
  caption: { fontSize: 13, lineHeight: 18, fontFamily: fonts.interRegular },
  label: { fontSize: 12, lineHeight: 16, fontFamily: fonts.interMedium },
};
