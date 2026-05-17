import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@src/hooks/useTheme';
import { useHaptic } from '@src/hooks/useHaptic';
import { spacing, typography } from '@src/theme';

type Props = {
  title?: string;
  subtitle?: string;
  right?: ReactNode;
  onBack?: () => void;
  hideBack?: boolean;
};

export const HeaderBar = ({ title, subtitle, right, onBack, hideBack }: Props) => {
  const { theme } = useTheme();
  const router = useRouter();
  const haptic = useHaptic();
  return (
    <View style={styles.bar}>
      {!hideBack ? (
        <Pressable
          onPress={() => {
            haptic.light();
            (onBack ?? router.back)();
          }}
          style={[styles.backBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
          hitSlop={10}
        >
          <ChevronLeft size={22} color={theme.text} />
        </Pressable>
      ) : (
        <View style={{ width: 40 }} />
      )}
      <View style={styles.titleBlock}>
        {title ? (
          <Text style={[typography.h2, { color: theme.text }]} numberOfLines={1}>
            {title}
          </Text>
        ) : null}
        {subtitle ? (
          <Text style={[typography.caption, { color: theme.textMuted }]} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={styles.right}>{right}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBlock: {
    flex: 1,
    marginLeft: spacing.md,
  },
  right: { minWidth: 40, alignItems: 'flex-end' },
});
