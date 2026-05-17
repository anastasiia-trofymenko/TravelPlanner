import { ReactNode } from 'react';
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@src/hooks/useTheme';
import { spacing } from '@src/theme';

type Props = {
  children: ReactNode;
  scrollable?: boolean;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  bgOverride?: string;
};

export const Screen = ({
  children,
  scrollable = false,
  edges = ['top'],
  padded = true,
  style,
  contentStyle,
  bgOverride,
}: Props) => {
  const { theme } = useTheme();
  const bg = bgOverride ?? theme.background;

  const inner = padded ? styles.paddedContent : undefined;

  return (
    <SafeAreaView edges={edges} style={[styles.flex, { backgroundColor: bg }, style]}>
      {scrollable ? (
        <ScrollView
          contentContainerStyle={[styles.scrollPad, inner, contentStyle]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, inner, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  paddedContent: { paddingHorizontal: spacing.xl },
  scrollPad: { paddingBottom: spacing.huge },
});
