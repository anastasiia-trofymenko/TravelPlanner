export const palette = {
  coral500: '#FF6B6B',
  coral600: '#FF3D7F',
  coral700: '#E11D74',

  ink900: '#0F172A',
  ink700: '#334155',
  ink500: '#64748B',
  ink300: '#94A3B8',

  surface0: '#FFFFFF',
  surface50: '#F7F8FA',
  surface100: '#EEF0F4',
  surface200: '#E2E6EE',

  eco500: '#22C55E',
  eco600: '#16A34A',
  eco100: '#DCFCE7',

  warn500: '#F59E0B',
  warn100: '#FEF3C7',

  danger500: '#EF4444',
  danger100: '#FEE2E2',

  indigo500: '#6366F1',
  indigo100: '#E0E7FF',

  modeTrain: '#6366F1',
  modeBus: '#0EA5E9',
  modeFlight: '#8B5CF6',
  modeSubway: '#F97316',
  modeTaxi: '#FACC15',
  modeWalk: '#94A3B8',
  modeTram: '#EC4899',
  modeFerry: '#06B6D4',
};

export const lightTheme = {
  primary: palette.coral600,
  primaryDark: palette.coral700,
  gradientStart: palette.coral500,
  gradientEnd: palette.coral600,
  background: palette.surface50,
  card: palette.surface0,
  cardAlt: palette.surface100,
  border: palette.surface200,
  text: palette.ink900,
  textMuted: palette.ink500,
  textSubtle: palette.ink300,
  eco: palette.eco500,
  ecoSoft: palette.eco100,
  warn: palette.warn500,
  warnSoft: palette.warn100,
  danger: palette.danger500,
  dangerSoft: palette.danger100,
  accent: palette.indigo500,
  accentSoft: palette.indigo100,
  onPrimary: '#FFFFFF',
  scrim: 'rgba(15, 23, 42, 0.45)',
};

export const darkTheme: typeof lightTheme = {
  primary: palette.coral600,
  primaryDark: palette.coral700,
  gradientStart: palette.coral500,
  gradientEnd: palette.coral600,
  background: '#0B1220',
  card: '#111A2E',
  cardAlt: '#19243B',
  border: '#27324A',
  text: '#F8FAFC',
  textMuted: '#94A3B8',
  textSubtle: '#64748B',
  eco: palette.eco500,
  ecoSoft: 'rgba(34,197,94,0.18)',
  warn: palette.warn500,
  warnSoft: 'rgba(245,158,11,0.18)',
  danger: palette.danger500,
  dangerSoft: 'rgba(239,68,68,0.18)',
  accent: palette.indigo500,
  accentSoft: 'rgba(99,102,241,0.18)',
  onPrimary: '#FFFFFF',
  scrim: 'rgba(0,0,0,0.55)',
};

export type Theme = typeof lightTheme;

export const modeColor: Record<string, string> = {
  train: palette.modeTrain,
  bus: palette.modeBus,
  flight: palette.modeFlight,
  subway: palette.modeSubway,
  taxi: palette.modeTaxi,
  walk: palette.modeWalk,
  tram: palette.modeTram,
  ferry: palette.modeFerry,
};
