import { StyleSheet, Text, View } from 'react-native';
import type { Segment } from '@src/mock/types';
import { useTheme } from '@src/hooks/useTheme';
import { modeColor, radius, spacing, typography } from '@src/theme';
import { ModeIcon } from './ModeIcon';

type Props = {
  segments: Segment[];
};

export const SegmentTimeline = ({ segments }: Props) => {
  const { theme } = useTheme();
  const totalMin = segments.reduce((sum, s) => sum + s.durationMin, 0);

  return (
    <View>
      <View style={styles.row}>
        {segments.map((seg, i) => {
          const flex = Math.max(0.5, seg.durationMin / Math.max(totalMin, 1));
          return (
            <View
              key={seg.id}
              style={[
                styles.segment,
                {
                  backgroundColor: modeColor[seg.mode],
                  flexGrow: flex,
                  marginRight: i === segments.length - 1 ? 0 : 3,
                },
              ]}
            >
              <ModeIcon mode={seg.mode} size={14} color="#FFFFFF" />
            </View>
          );
        })}
      </View>
      <View style={styles.labelRow}>
        <Text style={[typography.caption, { color: theme.textMuted }]}>
          {segments[0]?.from.station ?? ''}
        </Text>
        <Text style={[typography.caption, { color: theme.textMuted }]}>
          {segments[segments.length - 1]?.to.station ?? ''}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    height: 28,
    alignItems: 'stretch',
  },
  segment: {
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
    minWidth: 28,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
});
