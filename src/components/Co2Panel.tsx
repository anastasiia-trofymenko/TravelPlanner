import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Leaf } from 'lucide-react-native';
import { useTheme } from '@src/hooks/useTheme';
import { radius, spacing, typography } from '@src/theme';

type Props = {
  routeCo2Kg: number;
  flightAltCo2Kg: number;
};

export const Co2Panel = ({ routeCo2Kg, flightAltCo2Kg }: Props) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const isLessThanFlight = routeCo2Kg < flightAltCo2Kg;
  const pct = isLessThanFlight
    ? Math.round(((flightAltCo2Kg - routeCo2Kg) / Math.max(flightAltCo2Kg, 0.01)) * 100)
    : 0;

  return (
    <View style={[styles.panel, { backgroundColor: theme.ecoSoft }]}>
      <View style={[styles.iconWrap, { backgroundColor: theme.eco }]}>
        <Leaf size={18} color="#FFFFFF" />
      </View>
      <View style={styles.copy}>
        <Text style={[typography.h3, { color: theme.eco }]}>{t('route.co2Title')}</Text>
        <Text style={[typography.body, { color: theme.text, marginTop: 4 }]}>
          {isLessThanFlight
            ? t('route.co2Body', { kg: routeCo2Kg.toFixed(1), pct })
            : t('route.co2BodyFlight', { kg: routeCo2Kg.toFixed(1) })}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  panel: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.lg,
    borderRadius: radius.lg,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  copy: { flex: 1 },
});
