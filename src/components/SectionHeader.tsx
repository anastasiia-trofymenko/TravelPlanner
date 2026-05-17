import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@src/hooks/useTheme';
import { spacing, typography } from '@src/theme';

type Props = {
  title: string;
  action?: ReactNode;
  caption?: string;
};

export const SectionHeader = ({ title, action, caption }: Props) => {
  const { theme } = useTheme();
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={[typography.overline, { color: theme.textMuted }]}>{title}</Text>
        {caption ? (
          <Text style={[typography.caption, { color: theme.textMuted, marginTop: 2 }]}>
            {caption}
          </Text>
        ) : null}
      </View>
      {action}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
});
