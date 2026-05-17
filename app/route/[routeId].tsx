import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Heart, ShieldCheck, Zap } from 'lucide-react-native';
import { Pressable } from 'react-native';
import { Screen } from '@src/components/Screen';
import { HeaderBar } from '@src/components/HeaderBar';
import { Card } from '@src/components/Card';
import { Button } from '@src/components/Button';
import { Badge } from '@src/components/Badge';
import { JourneyTimeline } from '@src/components/JourneyTimeline';
import { RouteMap } from '@src/components/RouteMap';
import { Co2Panel } from '@src/components/Co2Panel';
import { PriceTag } from '@src/components/PriceTag';
import { useSearchStore } from '@src/store/useSearchStore';
import { useTripsStore } from '@src/store/useTripsStore';
import { useTheme } from '@src/hooks/useTheme';
import { useHaptic } from '@src/hooks/useHaptic';
import { spacing, typography, radius } from '@src/theme';
import { formatDuration } from '@src/utils/format';

export default function RouteDetail() {
  const { t } = useTranslation();
  const { routeId, searchId } = useLocalSearchParams<{ routeId: string; searchId?: string }>();
  const router = useRouter();
  const { theme } = useTheme();
  const haptic = useHaptic();
  const getResults = useSearchStore((s) => s.getResults);
  const allRoutes = (getResults(searchId ?? '') ?? []);
  const route = allRoutes.find((r) => r.id === routeId);
  const isSaved = useTripsStore((s) => (route ? s.isRouteSaved(route.id) : false));
  const toggleSaved = useTripsStore((s) => s.toggleSavedRoute);

  if (!route) {
    return (
      <Screen>
        <HeaderBar title={t('route.title')} />
        <Text style={{ color: theme.text }}>Route not found.</Text>
      </Screen>
    );
  }

  const goBook = () => {
    haptic.medium();
    router.push(`/booking/${route.id}?searchId=${searchId ?? ''}` as any);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Screen padded={false}>
        <View style={{ paddingHorizontal: spacing.xl, paddingTop: spacing.sm }}>
          <HeaderBar
            title={`${route.origin.name} → ${route.destination.name}`}
            subtitle={`${formatDuration(route.totalDurationMin)} · ${
              route.transferCount === 0
                ? t('common.direct')
                : `${route.transferCount} ${t(
                    route.transferCount === 1 ? 'common.transfer' : 'common.transfers',
                  )}`
            }`}
            right={
              <Pressable
                hitSlop={10}
                onPress={() => {
                  haptic.light();
                  toggleSaved(route);
                }}
              >
                <Heart
                  size={22}
                  color={isSaved ? theme.primary : theme.textMuted}
                  fill={isSaved ? theme.primary : 'transparent'}
                />
              </Pressable>
            }
          />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <View style={{ paddingHorizontal: spacing.xl }}>
            <RouteMap route={route} height={200} />
          </View>

          <View style={[styles.summaryRow, { paddingHorizontal: spacing.xl }]}>
            <View style={styles.badgeRow}>
              {route.badges.map((b) => (
                <Badge key={b} label={t(`results.badges.${b}`)} variant={b} />
              ))}
            </View>
          </View>

          <Card style={[styles.metricsCard, { marginHorizontal: spacing.xl }]}>
            <View style={styles.metricsRow}>
              <View style={styles.metric}>
                <ShieldCheck size={20} color={theme.eco} />
                <Text style={[typography.caption, { color: theme.textMuted, marginTop: 4 }]}>
                  {t('route.reliability')}
                </Text>
                <Text style={[typography.h3, { color: theme.text }]}>
                  {route.reliabilityPct}%
                </Text>
              </View>
              <View style={[styles.metric, { borderLeftWidth: 1, borderColor: theme.border }]}>
                <Zap size={20} color={theme.accent} />
                <Text style={[typography.caption, { color: theme.textMuted, marginTop: 4 }]}>
                  {t('common.duration')}
                </Text>
                <Text style={[typography.h3, { color: theme.text }]}>
                  {formatDuration(route.totalDurationMin)}
                </Text>
              </View>
            </View>
          </Card>

          <View style={{ paddingHorizontal: spacing.xl, marginTop: spacing.lg }}>
            <Co2Panel routeCo2Kg={route.totalCo2Kg} flightAltCo2Kg={route.flightAltCo2Kg} />
          </View>

          <View style={{ paddingHorizontal: spacing.xl, marginTop: spacing.lg }}>
            <JourneyTimeline segments={route.segments} />
          </View>
        </ScrollView>

        <View
          style={[
            styles.bookBar,
            { backgroundColor: theme.card, borderTopColor: theme.border },
          ]}
        >
          <PriceTag amount={route.totalPriceEur} size="md" caption={t('route.totalPrice')} />
          <View style={{ flex: 1, marginLeft: spacing.lg }}>
            <Button label={t('route.bookCta')} onPress={goBook} />
          </View>
        </View>
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: spacing.sm, paddingBottom: 160 },
  summaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.md,
  },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  metricsCard: { marginTop: spacing.md },
  metricsRow: { flexDirection: 'row' },
  metric: { flex: 1, alignItems: 'flex-start', paddingHorizontal: spacing.sm },
  bookBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    paddingBottom: spacing.xxl,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
