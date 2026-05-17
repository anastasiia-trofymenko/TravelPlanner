import { ReactNode } from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@src/hooks/useTheme';
import { useHaptic } from '@src/hooks/useHaptic';
import { radius, shadows, spacing, typography } from '@src/theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  icon?: ReactNode;
  iconRight?: ReactNode;
  disabled?: boolean;
  full?: boolean;
  style?: StyleProp<ViewStyle>;
  large?: boolean;
};

export const Button = ({
  label,
  onPress,
  variant = 'primary',
  icon,
  iconRight,
  disabled,
  full = true,
  style,
  large,
}: Props) => {
  const { theme } = useTheme();
  const haptic = useHaptic();

  const handlePress = () => {
    if (disabled) return;
    haptic.light();
    onPress?.();
  };

  const isPrimary = variant === 'primary';
  const isDanger = variant === 'danger';
  const isGhost = variant === 'ghost';

  const content = (
    <View style={styles.row}>
      {icon ? <View style={styles.iconLeft}>{icon}</View> : null}
      <Text
        style={[
          large ? typography.h3 : typography.bodyStrong,
          {
            color: isPrimary || isDanger ? '#FFFFFF' : isGhost ? theme.text : theme.text,
          },
        ]}
      >
        {label}
      </Text>
      {iconRight ? <View style={styles.iconRight}>{iconRight}</View> : null}
    </View>
  );

  const padding = large
    ? { paddingVertical: spacing.lg, paddingHorizontal: spacing.xxl }
    : { paddingVertical: spacing.md + 2, paddingHorizontal: spacing.xl };

  if (isPrimary) {
    return (
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        style={({ pressed }) => [
          styles.shell,
          shadows.primary,
          padding,
          { opacity: disabled ? 0.5 : pressed ? 0.92 : 1, width: full ? '100%' : undefined },
          style,
        ]}
      >
        <LinearGradient
          colors={[theme.gradientStart, theme.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
        {content}
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.shell,
        padding,
        {
          backgroundColor: isDanger
            ? theme.danger
            : isGhost
            ? 'transparent'
            : theme.card,
          borderWidth: isGhost ? 0 : 1,
          borderColor: isDanger ? theme.danger : theme.border,
          opacity: disabled ? 0.5 : pressed ? 0.92 : 1,
          width: full ? '100%' : undefined,
        },
        style,
      ]}
    >
      {content}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  shell: {
    borderRadius: radius.pill,
    overflow: 'hidden',
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: { marginRight: spacing.sm },
  iconRight: { marginLeft: spacing.sm },
});
