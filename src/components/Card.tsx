import { ReactNode } from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '@src/hooks/useTheme';
import { radius, shadows, spacing } from '@src/theme';

type Props = {
  children: ReactNode;
  onPress?: () => void;
  padding?: number;
  style?: StyleProp<ViewStyle>;
  variant?: 'plain' | 'soft' | 'outlined';
};

export const Card = ({
  children,
  onPress,
  padding = spacing.lg,
  style,
  variant = 'plain',
}: Props) => {
  const { theme } = useTheme();
  const baseStyle: ViewStyle = {
    backgroundColor: variant === 'soft' ? theme.cardAlt : theme.card,
    borderWidth: variant === 'outlined' ? 1 : 0,
    borderColor: theme.border,
    borderRadius: radius.lg,
    padding,
  };
  const stack = [styles.card, baseStyle, variant === 'plain' ? shadows.sm : null, style];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [...stack, { opacity: pressed ? 0.94 : 1 }]}
      >
        {children}
      </Pressable>
    );
  }
  return <View style={stack}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {},
});
