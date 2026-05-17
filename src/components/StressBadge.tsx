import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@src/hooks/useTheme';
import { radius, spacing, typography } from '@src/theme';

type Level = 'free' | 'tight' | 'risky';

export const stressLevelFromMinutes = (bufferMin: number): Level => {
  if (bufferMin >= 15) return 'free';
  if (bufferMin >= 7) return 'tight';
  return 'risky';
};

export const StressBadge = ({ bufferMin }: { bufferMin: number }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const level = stressLevelFromMinutes(bufferMin);
  let bg = theme.ecoSoft;
  let fg = theme.eco;
  if (level === 'tight') {
    bg = theme.warnSoft;
    fg = theme.warn;
  } else if (level === 'risky') {
    bg = theme.dangerSoft;
    fg = theme.danger;
  }
  return (
    <View style={[styles.shell, { backgroundColor: bg }]}>
      <Text style={[typography.caption, { color: fg }]}>{t(`stress.${level}`)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  shell: {
    paddingVertical: 3,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
  },
});
