import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@src/hooks/useTheme';
import { useHaptic } from '@src/hooks/useHaptic';
import { radius, spacing, typography } from '@src/theme';

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: ReactNode;
  color?: string;
  size?: 'sm' | 'md';
};

export const Chip = ({ label, selected, onPress, icon, color, size = 'md' }: Props) => {
  const { theme } = useTheme();
  const haptic = useHaptic();
  const padV = size === 'sm' ? 6 : 8;
  const padH = size === 'sm' ? 10 : 14;

  const accent = color ?? theme.primary;
  const bg = selected ? accent : theme.card;
  const fg = selected ? '#FFFFFF' : theme.text;
  const border = selected ? accent : theme.border;

  return (
    <Pressable
      onPress={() => {
        if (onPress) {
          haptic.light();
          onPress();
        }
      }}
      style={({ pressed }) => [
        styles.chip,
        {
          paddingVertical: padV,
          paddingHorizontal: padH,
          backgroundColor: bg,
          borderColor: border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      {icon ? <View style={styles.icon}>{icon}</View> : null}
      <Text style={[size === 'sm' ? typography.caption : typography.bodyStrong, { color: fg }]}>
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  icon: { marginRight: spacing.xs },
});
