import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Wifi, Table, Armchair } from 'lucide-react-native';
import type { Segment } from '@src/mock/types';
import { useTheme } from '@src/hooks/useTheme';
import { modeColor, radius, spacing, typography } from '@src/theme';
import { ModeIcon } from './ModeIcon';
import { StressBadge } from './StressBadge';
import { diffMinutes, formatClock, formatDuration } from '@src/utils/format';

type Props = {
  segments: Segment[];
  highlightSegmentIndex?: number;
};

export const JourneyTimeline = ({ segments, highlightSegmentIndex }: Props) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <View>
      {segments.map((seg, i) => {
        const prev = i > 0 ? segments[i - 1] : null;
        const buffer = prev ? diffMinutes(prev.arrival, seg.departure) : 0;
        const active = highlightSegmentIndex === i;
        return (
          <View key={seg.id}>
            {prev ? (
              <View style={styles.transferRow}>
                <View style={[styles.dotMuted, { backgroundColor: theme.border }]} />
                <View style={styles.transferContent}>
                  <Text style={[typography.caption, { color: theme.textMuted }]}>
                    {t('route.minTransfer', { m: buffer })}
                  </Text>
                  <StressBadge bufferMin={buffer} />
                </View>
              </View>
            ) : null}
            <View style={styles.segRow}>
              <View style={styles.timeCol}>
                <Text style={[typography.bodyStrong, { color: theme.text }]}>
                  {formatClock(seg.departure)}
                </Text>
                <View
                  style={[
                    styles.connector,
                    { backgroundColor: modeColor[seg.mode], opacity: active ? 1 : 0.6 },
                  ]}
                />
                <Text style={[typography.bodyStrong, { color: theme.text }]}>
                  {formatClock(seg.arrival)}
                </Text>
              </View>
              <View style={styles.dotsCol}>
                <View
                  style={[
                    styles.dot,
                    {
                      borderColor: modeColor[seg.mode],
                      backgroundColor: active ? modeColor[seg.mode] : '#FFFFFF',
                    },
                  ]}
                />
                <View style={[styles.line, { backgroundColor: modeColor[seg.mode] }]} />
                <View
                  style={[
                    styles.dot,
                    { borderColor: modeColor[seg.mode], backgroundColor: '#FFFFFF' },
                  ]}
                />
              </View>
              <View
                style={[
                  styles.contentCol,
                  active && {
                    backgroundColor: theme.cardAlt,
                    borderRadius: radius.md,
                    padding: spacing.md,
                  },
                ]}
              >
                <View style={styles.stationRow}>
                  <Text style={[typography.bodyStrong, { color: theme.text }]}>
                    {seg.from.station}
                  </Text>
                  {seg.platform ? (
                    <Text style={[typography.caption, { color: theme.textMuted }]}>
                      {t('route.platform', { p: seg.platform })}
                    </Text>
                  ) : null}
                </View>
                <View style={styles.modeRow}>
                  <ModeIcon mode={seg.mode} size={16} />
                  <Text style={[typography.body, { color: theme.text, marginLeft: 6 }]}>
                    {seg.line} · {seg.operator}
                  </Text>
                  <Text
                    style={[
                      typography.caption,
                      { color: theme.textMuted, marginLeft: spacing.sm },
                    ]}
                  >
                    {formatDuration(seg.durationMin)}
                  </Text>
                </View>
                <View style={styles.featureRow}>
                  {seg.seat ? (
                    <View style={styles.feature}>
                      <Armchair size={12} color={theme.textMuted} />
                      <Text style={[typography.caption, { color: theme.textMuted, marginLeft: 4 }]}>
                        {t('route.seat', { s: seg.seat })}
                      </Text>
                    </View>
                  ) : null}
                  {seg.hasWifi ? (
                    <View style={styles.feature}>
                      <Wifi size={12} color={theme.textMuted} />
                      <Text style={[typography.caption, { color: theme.textMuted, marginLeft: 4 }]}>
                        {t('route.wifi')}
                      </Text>
                    </View>
                  ) : null}
                  {seg.hasTable ? (
                    <View style={styles.feature}>
                      <Table size={12} color={theme.textMuted} />
                      <Text style={[typography.caption, { color: theme.textMuted, marginLeft: 4 }]}>
                        {t('route.table')}
                      </Text>
                    </View>
                  ) : null}
                </View>
                <View style={[styles.stationRow, { marginTop: spacing.sm }]}>
                  <Text style={[typography.bodyStrong, { color: theme.text }]}>
                    {seg.to.station}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  segRow: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
  },
  timeCol: {
    width: 56,
    alignItems: 'flex-end',
    paddingRight: spacing.sm,
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  connector: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },
  dotsCol: {
    width: 18,
    alignItems: 'center',
    paddingVertical: 4,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 3,
  },
  line: {
    width: 3,
    flex: 1,
    marginVertical: 2,
    borderRadius: 2,
  },
  contentCol: {
    flex: 1,
    paddingLeft: spacing.md,
  },
  stationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  featureRow: {
    flexDirection: 'row',
    marginTop: 6,
    flexWrap: 'wrap',
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.sm,
    marginTop: 2,
  },
  transferRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 56 + 9,
    marginVertical: 4,
  },
  dotMuted: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
  transferContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});
