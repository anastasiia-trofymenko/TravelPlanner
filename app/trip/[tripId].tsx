import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Share2, MapPinned, MessageSquare, Radio } from 'lucide-react-native';
import { Screen } from '@src/components/Screen';
import { HeaderBar } from '@src/components/HeaderBar';
import { Card } from '@src/components/Card';
import { Button } from '@src/components/Button';
import { JourneyTimeline } from '@src/components/JourneyTimeline';
import { useTripsStore } from '@src/store/useTripsStore';
import { useTheme } from '@src/hooks/useTheme';
import { useHaptic } from '@src/hooks/useHaptic';
import { radius, spacing, typography } from '@src/theme';
import { diffMinutes, formatClock, formatLongDate, relativeFromNow } from '@src/utils/format';

export default function TripDetail() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const { t } = useTranslation();
  const router = useRouter();
  const { theme } = useTheme();
  const haptic = useHaptic();
  const trip = useTripsStore((s) => s.getTrip(tripId!));
  const setStatus = useTripsStore((s) => s.setTripStatus);

  if (!trip) {
    return (
      <Screen>
        <HeaderBar title={t('trips.title')} />
        <Text style={{ color: theme.text }}>Trip not found.</Text>
      </Screen>
    );
  }

  const isActive = trip.status === 'active';
  const isUpcoming = trip.status === 'upcoming';
  const isPast = trip.status === 'past';

  const currentSegmentIndex = useMemo(() => {
    if (!isActive) return -1;
    return Math.floor(trip.route.segments.length / 2);
  }, [isActive, trip]);

  const departureRel = relativeFromNow(trip.route.departureAt);
  const nextTransfer = trip.route.segments
    .slice(currentSegmentIndex + 1, currentSegmentIndex + 2)
    .map((s) =>
      diffMinutes(trip.route.segments[currentSegmentIndex]?.arrival ?? new Date().toISOString(), s.departure),
    )[0];

  const statusText = isUpcoming
    ? t('trips.departsIn', { when: departureRel.text })
    : isActive
    ? t('trips.inTransit')
    : t('trips.completed');

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Screen padded={false}>
        <LinearGradient
          colors={
            isPast
              ? [theme.eco, theme.eco]
              : isActive
              ? [theme.accent, theme.primary]
              : [theme.gradientStart, theme.gradientEnd]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={{ paddingHorizontal: spacing.xl, paddingTop: spacing.xs }}>
            <HeaderBar
              title={`${trip.route.origin.name} → ${trip.route.destination.name}`}
              subtitle={formatLongDate(trip.route.departureAt)}
              right={
                <Pressable
                  onPress={() => {
                    haptic.light();
                  }}
                  hitSlop={10}
                >
                  <Share2 size={20} color={theme.text} />
                </Pressable>
              }
            />
          </View>
          <View style={styles.heroBody}>
            <View
              style={[
                styles.statusPill,
                { backgroundColor: 'rgba(255,255,255,0.22)' },
              ]}
            >
              <View
                style={[
                  styles.pulseDot,
                  { backgroundColor: '#FFFFFF', opacity: isActive ? 1 : 0.6 },
                ]}
              />
              <Text style={[typography.bodyStrong, { color: '#FFFFFF', marginLeft: 8 }]}>
                {statusText}
              </Text>
            </View>
            <Text style={[typography.display, { color: '#FFFFFF', marginTop: spacing.lg }]}>
              {formatClock(trip.route.departureAt)} → {formatClock(trip.route.arrivalAt)}
            </Text>
            <Text style={[typography.body, { color: 'rgba(255,255,255,0.9)' }]}>
              {trip.route.transferCount === 0
                ? t('common.direct')
                : `${trip.route.transferCount} ${t(
                    trip.route.transferCount === 1 ? 'common.transfer' : 'common.transfers',
                  )}`}{' '}
              · {trip.route.totalCo2Kg.toFixed(1)} kg CO₂
            </Text>
          </View>
        </LinearGradient>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {isActive && nextTransfer ? (
            <Card style={styles.transferInfoCard}>
              <Radio size={18} color={theme.accent} />
              <Text style={[typography.bodyStrong, { color: theme.text, marginLeft: spacing.sm, flex: 1 }]}>
                {t('trip.nextTransfer', { m: Math.max(0, nextTransfer) })}
              </Text>
            </Card>
          ) : null}

          <View style={styles.actionsRow}>
            <View style={{ flex: 1 }}>
              <Button
                label={t('trip.directions')}
                variant="secondary"
                icon={<MapPinned size={16} color={theme.text} />}
                onPress={() => haptic.light()}
              />
            </View>
            <View style={{ width: spacing.sm }} />
            <View style={{ flex: 1 }}>
              <Button
                label={t('trip.notifyFriend')}
                variant="ghost"
                icon={<Share2 size={16} color={theme.text} />}
                onPress={() => haptic.light()}
              />
            </View>
          </View>

          <View style={{ marginTop: spacing.lg }}>
            <JourneyTimeline
              segments={trip.route.segments}
              highlightSegmentIndex={isActive ? currentSegmentIndex : undefined}
            />
          </View>

          {isUpcoming ? (
            <View style={{ marginTop: spacing.xl }}>
              <Button
                label={t('trips.viewLive')}
                variant="primary"
                onPress={() => {
                  haptic.medium();
                  setStatus(trip.id, 'active');
                }}
              />
            </View>
          ) : null}

          {isActive ? (
            <View style={{ marginTop: spacing.xl }}>
              <Button
                label={t('trips.leaveFeedback')}
                variant="primary"
                icon={<MessageSquare size={16} color="#FFFFFF" />}
                onPress={() => {
                  haptic.medium();
                  setStatus(trip.id, 'past');
                  router.push(`/feedback/${trip.id}` as any);
                }}
              />
            </View>
          ) : null}
        </ScrollView>
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingBottom: spacing.xxxl,
    paddingTop: spacing.md,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  heroBody: { paddingHorizontal: spacing.xl, marginTop: spacing.lg },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  pulseDot: { width: 8, height: 8, borderRadius: 4 },
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: 140 },
  transferInfoCard: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  actionsRow: { flexDirection: 'row', marginTop: spacing.sm },
});
