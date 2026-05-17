import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Briefcase, MessageSquare, Radio } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTripsStore } from '@src/store/useTripsStore';
import { useTheme } from '@src/hooks/useTheme';
import { useHaptic } from '@src/hooks/useHaptic';
import { Card } from '@src/components/Card';
import { Badge } from '@src/components/Badge';
import { ModeIcon } from '@src/components/ModeIcon';
import { EmptyState } from '@src/components/EmptyState';
import { Button } from '@src/components/Button';
import {
  formatClock,
  formatDuration,
  formatShortDate,
  relativeFromNow,
} from '@src/utils/format';
import { radius, spacing, typography } from '@src/theme';
import type { TripStatus } from '@src/mock/types';

const TABS: { key: TripStatus; labelKey: string }[] = [
  { key: 'upcoming', labelKey: 'trips.tabs.upcoming' },
  { key: 'active', labelKey: 'trips.tabs.active' },
  { key: 'past', labelKey: 'trips.tabs.past' },
];

export default function MyTrips() {
  const { t } = useTranslation();
  const router = useRouter();
  const { theme } = useTheme();
  const haptic = useHaptic();
  const trips = useTripsStore((s) => s.trips);
  const setTripStatus = useTripsStore((s) => s.setTripStatus);
  const [tab, setTab] = useState<TripStatus>('upcoming');

  const filtered = useMemo(() => trips.filter((tr) => tr.status === tab), [trips, tab]);

  const onMarkActive = (id: string) => {
    haptic.medium();
    setTripStatus(id, 'active');
    router.push(`/trip/${id}` as any);
  };

  const onMarkPast = (id: string) => {
    haptic.medium();
    setTripStatus(id, 'past');
    router.push(`/feedback/${id}` as any);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <Animated.View entering={FadeInDown.duration(400)}>
            <Text style={[typography.h1, { color: theme.text }]}>{t('trips.title')}</Text>
          </Animated.View>

          <View style={[styles.tabsRow, { backgroundColor: theme.cardAlt }]}>
            {TABS.map(({ key, labelKey }) => {
              const active = tab === key;
              return (
                <Pressable
                  key={key}
                  onPress={() => {
                    haptic.light();
                    setTab(key);
                  }}
                  style={[styles.tab, active && { backgroundColor: theme.card }]}
                >
                  <Text
                    style={[
                      typography.bodyStrong,
                      { color: active ? theme.text : theme.textMuted },
                    ]}
                  >
                    {t(labelKey)}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {filtered.length === 0 ? (
            <EmptyState
              icon={<Briefcase size={40} color={theme.primary} />}
              title={t(`trips.empty${tab.charAt(0).toUpperCase() + tab.slice(1)}` as any)}
            />
          ) : (
            <View style={{ marginTop: spacing.lg, gap: spacing.md }}>
              {filtered.map((trip) => {
                const rel = relativeFromNow(trip.route.departureAt);
                return (
                  <Card
                    key={trip.id}
                    onPress={() => router.push(`/trip/${trip.id}` as any)}
                  >
                    <View style={styles.tripHeader}>
                      <View>
                        <Text style={[typography.h3, { color: theme.text }]}>
                          {trip.route.origin.name} → {trip.route.destination.name}
                        </Text>
                        <Text style={[typography.caption, { color: theme.textMuted, marginTop: 2 }]}>
                          {formatShortDate(trip.route.departureAt)} · {formatClock(trip.route.departureAt)} →{' '}
                          {formatClock(trip.route.arrivalAt)}
                        </Text>
                      </View>
                      {trip.status === 'upcoming' ? (
                        <Badge label={t('trips.departsIn', { when: rel.text })} variant="neutral" />
                      ) : trip.status === 'active' ? (
                        <Badge label={t('trips.inTransit')} variant="best" />
                      ) : (
                        <Badge label={t('trips.completed')} variant="eco" />
                      )}
                    </View>
                    <View style={styles.modeRow}>
                      {trip.route.segments.map((seg, i) => (
                        <View key={seg.id} style={styles.modePill}>
                          <ModeIcon mode={seg.mode} size={14} />
                          <Text
                            style={[
                              typography.caption,
                              { color: theme.textMuted, marginLeft: 4 },
                            ]}
                          >
                            {formatDuration(seg.durationMin)}
                          </Text>
                          {i < trip.route.segments.length - 1 ? (
                            <Text style={[typography.caption, { color: theme.textMuted, marginHorizontal: 4 }]}>
                              ·
                            </Text>
                          ) : null}
                        </View>
                      ))}
                    </View>
                    <View style={styles.actionsRow}>
                      {trip.status === 'upcoming' ? (
                        <Button
                          label={t('trips.viewLive')}
                          variant="secondary"
                          full={false}
                          icon={<Radio size={16} color={theme.text} />}
                          onPress={() => onMarkActive(trip.id)}
                        />
                      ) : trip.status === 'active' ? (
                        <Button
                          label={t('trips.leaveFeedback')}
                          variant="primary"
                          full={false}
                          icon={<MessageSquare size={16} color="#FFFFFF" />}
                          onPress={() => onMarkPast(trip.id)}
                        />
                      ) : (
                        trip.feedback ? (
                          <Text style={[typography.caption, { color: theme.textMuted }]}>
                            {'★'.repeat(trip.feedback.rating)}{'☆'.repeat(5 - trip.feedback.rating)}
                          </Text>
                        ) : (
                          <Button
                            label={t('trips.leaveFeedback')}
                            variant="secondary"
                            full={false}
                            icon={<MessageSquare size={16} color={theme.text} />}
                            onPress={() => router.push(`/feedback/${trip.id}` as any)}
                          />
                        )
                      )}
                    </View>
                  </Card>
                );
              })}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: 120,
  },
  tabsRow: {
    flexDirection: 'row',
    borderRadius: radius.pill,
    padding: 4,
    marginTop: spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: radius.pill,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  modeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
    alignItems: 'center',
  },
  modePill: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionsRow: {
    marginTop: spacing.md,
    flexDirection: 'row',
  },
});
