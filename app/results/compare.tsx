import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@src/components/Screen';
import { HeaderBar } from '@src/components/HeaderBar';
import { Card } from '@src/components/Card';
import { Button } from '@src/components/Button';
import { SegmentTimeline } from '@src/components/SegmentTimeline';
import { Badge } from '@src/components/Badge';
import { useTheme } from '@src/hooks/useTheme';
import { useSearchStore } from '@src/store/useSearchStore';
import { spacing, typography } from '@src/theme';
import { formatDuration, formatPrice } from '@src/utils/format';

export default function Compare() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ ids?: string; searchId?: string }>();
  const ids = (params.ids ?? '').split(',').filter(Boolean);
  const getResults = useSearchStore((s) => s.getResults);
  const routes = (getResults(params.searchId ?? '') ?? []).filter((r) => ids.includes(r.id));

  return (
    <Screen scrollable>
      <HeaderBar title={t('results.compareTitle')} />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: spacing.xl }}>
        {routes.map((r) => (
          <Card key={r.id} style={styles.col}>
            <View style={styles.badgeRow}>
              {r.badges.map((b) => (
                <Badge key={b} label={t(`results.badges.${b}`)} variant={b} />
              ))}
            </View>
            <Text style={[typography.h2, { color: theme.text, marginTop: spacing.sm }]}>
              {formatDuration(r.totalDurationMin)}
            </Text>
            <Text style={[typography.h3, { color: theme.primary }]}>
              {formatPrice(r.totalPriceEur)}
            </Text>
            <View style={{ marginTop: spacing.md }}>
              <SegmentTimeline segments={r.segments} />
            </View>
            <View style={styles.metric}>
              <Text style={[typography.caption, { color: theme.textMuted }]}>CO₂</Text>
              <Text style={[typography.bodyStrong, { color: theme.text }]}>
                {r.totalCo2Kg.toFixed(1)} kg
              </Text>
            </View>
            <View style={styles.metric}>
              <Text style={[typography.caption, { color: theme.textMuted }]}>{t('common.transfers')}</Text>
              <Text style={[typography.bodyStrong, { color: theme.text }]}>{r.transferCount}</Text>
            </View>
            <View style={styles.metric}>
              <Text style={[typography.caption, { color: theme.textMuted }]}>{t('route.reliability')}</Text>
              <Text style={[typography.bodyStrong, { color: theme.text }]}>
                {r.reliabilityPct}%
              </Text>
            </View>
            <View style={{ marginTop: spacing.md }}>
              <Button
                label={t('results.viewDetails')}
                onPress={() =>
                  router.push(`/route/${r.id}?searchId=${params.searchId}` as any)
                }
                large={false}
              />
            </View>
          </Card>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  col: {
    width: 240,
    marginRight: spacing.md,
  },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  metric: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
});
