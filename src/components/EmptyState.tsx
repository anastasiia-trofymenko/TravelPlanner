import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@src/hooks/useTheme';
import { spacing, typography } from '@src/theme';

type Props = {
  icon: ReactNode;
  title: string;
  body?: string;
  action?: ReactNode;
};

export const EmptyState = ({ icon, title, body, action }: Props) => {
  const { theme } = useTheme();
  return (
    <View style={styles.wrap}>
      <View style={[styles.iconWrap, { backgroundColor: theme.cardAlt }]}>{icon}</View>
      <Text style={[typography.h2, { color: theme.text, marginTop: spacing.lg, textAlign: 'center' }]}>
        {title}
      </Text>
      {body ? (
        <Text
          style={[
            typography.body,
            { color: theme.textMuted, marginTop: spacing.sm, textAlign: 'center' },
          ]}
        >
          {body}
        </Text>
      ) : null}
      {action ? <View style={{ marginTop: spacing.lg }}>{action}</View> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingVertical: spacing.huge,
    paddingHorizontal: spacing.xl,
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
