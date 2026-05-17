import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@src/hooks/useTheme';
import { radius, spacing, typography } from '@src/theme';

type Variant = 'best' | 'fastest' | 'cheapest' | 'eco' | 'neutral' | 'warn';

type Props = {
  label: string;
  variant?: Variant;
};

export const Badge = ({ label, variant = 'neutral' }: Props) => {
  const { theme } = useTheme();
  let bg = theme.cardAlt;
  let fg = theme.text;
  switch (variant) {
    case 'best':
      bg = theme.primary;
      fg = '#FFFFFF';
      break;
    case 'fastest':
      bg = theme.accentSoft;
      fg = theme.accent;
      break;
    case 'cheapest':
      bg = theme.warnSoft;
      fg = theme.warn;
      break;
    case 'eco':
      bg = theme.ecoSoft;
      fg = theme.eco;
      break;
    case 'warn':
      bg = theme.dangerSoft;
      fg = theme.danger;
      break;
  }
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[typography.caption, { color: fg }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 4,
    paddingHorizontal: spacing.sm + 2,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
});
