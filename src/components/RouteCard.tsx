import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Heart, ArrowRight } from 'lucide-react-native';
import type { Route } from '@src/mock/types';
import { useTheme } from '@src/hooks/useTheme';
import { useTripsStore } from '@src/store/useTripsStore';
import { useHaptic } from '@src/hooks/useHaptic';
import { spacing, typography } from '@src/theme';
import { formatClock, formatDuration } from '@src/utils/format';
import { Badge } from './Badge';
import { Card } from './Card';
import { SegmentTimeline } from './SegmentTimeline';
import { PriceTag } from './PriceTag';
import { Pressable } from 'react-native';

type Props = {
  route: Route;
  onPress?: () => void;
  selectedForCompare?: boolean;
  onToggleCompare?: () => void;
};

export const RouteCard = ({ route, onPress, selectedForCompare, onToggleCompare }: Props) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const isSaved = useTripsStore((s) => s.isRouteSaved(route.id));
  const toggleSaved = useTripsStore((s) => s.toggleSavedRoute);
  const haptic = useHaptic();

  return (
    <Card onPress={onPress} padding={spacing.lg} style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.badgeRow}>
          {route.badges.map((b) => (
            <Badge key={b} label={t(`results.badges.${b}`)} variant={b} />
          ))}
          {route.transferCount === 0 ? (
            <Badge label={t('common.direct')} variant="neutral" />
          ) : (
            <Badge
              label={`${route.transferCount} ${t(
                route.transferCount === 1 ? 'common.transfer' : 'common.transfers',
              )}`}
              variant="neutral"
            />
          )}
        </View>
        <Pressable
          onPress={() => {
            haptic.light();
            toggleSaved(route);
          }}
          hitSlop={10}
        >
          <Heart
            size={22}
            color={isSaved ? theme.primary : theme.textMuted}
            fill={isSaved ? theme.primary : 'transparent'}
          />
        </Pressable>
      </View>

      <View style={styles.mainRow}>
        <View style={styles.timeBlock}>
          <Text style={[typography.numericLarge, { color: theme.text }]}>
            {formatClock(route.departureAt)}
          </Text>
          <Text style={[typography.caption, { color: theme.textMuted }]}>
            {route.origin.name}
          </Text>
        </View>
        <View style={styles.middle}>
          <Text style={[typography.bodyStrong, { color: theme.text }]}>
            {formatDuration(route.totalDurationMin)}
          </Text>
          <ArrowRight size={14} color={theme.textMuted} style={{ marginTop: 2 }} />
        </View>
        <View style={styles.timeBlock}>
          <Text style={[typography.numericLarge, { color: theme.text }]}>
            {formatClock(route.arrivalAt)}
          </Text>
          <Text style={[typography.caption, { color: theme.textMuted }]}>
            {route.destination.name}
          </Text>
        </View>
      </View>

      <View style={{ marginTop: spacing.md }}>
        <SegmentTimeline segments={route.segments} />
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.metaCol}>
          <Text style={[typography.caption, { color: theme.textMuted }]}>
            {route.totalCo2Kg.toFixed(1)} kg CO₂ · {route.reliabilityPct}% on-time
          </Text>
        </View>
        <PriceTag amount={route.totalPriceEur} size="md" />
      </View>

      {onToggleCompare ? (
        <Pressable
          onPress={() => {
            haptic.light();
            onToggleCompare();
          }}
          style={[
            styles.compareToggle,
            {
              backgroundColor: selectedForCompare ? theme.primary : 'transparent',
              borderColor: selectedForCompare ? theme.primary : theme.border,
            },
          ]}
        >
          <Text
            style={[
              typography.caption,
              {
                color: selectedForCompare ? '#FFFFFF' : theme.textMuted,
              },
            ]}
          >
            {selectedForCompare ? '✓ ' : ''}
            {t('results.compare')}
          </Text>
        </Pressable>
      ) : null}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    gap: 6,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  timeBlock: {
    flex: 1,
  },
  middle: {
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: spacing.md,
  },
  metaCol: { flex: 1 },
  compareToggle: {
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
});
