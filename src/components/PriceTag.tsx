import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@src/hooks/useTheme';
import { typography } from '@src/theme';
import { formatPrice } from '@src/utils/format';

type Props = {
  amount: number;
  size?: 'sm' | 'md' | 'lg';
  caption?: string;
};

export const PriceTag = ({ amount, size = 'md', caption }: Props) => {
  const { theme } = useTheme();
  const variant =
    size === 'lg' ? typography.numericLarge : size === 'sm' ? typography.bodyStrong : typography.h2;
  return (
    <View style={styles.wrap}>
      {caption ? (
        <Text style={[typography.caption, { color: theme.textMuted, marginBottom: 2 }]}>
          {caption}
        </Text>
      ) : null}
      <Text style={[variant, { color: theme.primary }]}>{formatPrice(amount)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { alignItems: 'flex-end' },
});
