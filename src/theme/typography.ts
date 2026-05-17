import { Platform, TextStyle } from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'System',
});

export const typography = {
  display: {
    fontFamily,
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: -0.8,
  } satisfies TextStyle,
  h1: {
    fontFamily,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.4,
  } satisfies TextStyle,
  h2: {
    fontFamily,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.2,
  } satisfies TextStyle,
  h3: {
    fontFamily,
    fontSize: 18,
    fontWeight: '700',
  } satisfies TextStyle,
  body: {
    fontFamily,
    fontSize: 15,
    fontWeight: '500',
  } satisfies TextStyle,
  bodyStrong: {
    fontFamily,
    fontSize: 15,
    fontWeight: '700',
  } satisfies TextStyle,
  caption: {
    fontFamily,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  } satisfies TextStyle,
  overline: {
    fontFamily,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  } satisfies TextStyle,
  numericLarge: {
    fontFamily,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  } satisfies TextStyle,
};

export type TypographyVariant = keyof typeof typography;
