import { useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { palette } from '@src/theme';

const COLORS = [palette.coral500, palette.coral600, palette.eco500, palette.indigo500, palette.warn500];
const PIECES = 28;

const ConfettiPiece = ({ index }: { index: number }) => {
  const { width, height } = Dimensions.get('window');
  const x = (Math.random() - 0.5) * width;
  const rotate = useSharedValue(0);
  const ty = useSharedValue(-50);
  const tx = useSharedValue(x);

  useEffect(() => {
    const delay = index * 35;
    ty.value = withDelay(
      delay,
      withTiming(height * 0.7 + Math.random() * 120, {
        duration: 1800 + Math.random() * 800,
        easing: Easing.out(Easing.cubic),
      }),
    );
    tx.value = withDelay(
      delay,
      withTiming(x + (Math.random() - 0.5) * 220, { duration: 1800 }),
    );
    rotate.value = withDelay(
      delay,
      withTiming(720 + Math.random() * 360, { duration: 1800 }),
    );
  }, [height, index, rotate, tx, ty, x]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: tx.value },
      { translateY: ty.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.piece,
        {
          backgroundColor: COLORS[index % COLORS.length],
          width: 8 + Math.random() * 8,
          height: 12 + Math.random() * 10,
        },
        style,
      ]}
    />
  );
};

export const ConfettiOverlay = () => {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {Array.from({ length: PIECES }).map((_, i) => (
        <ConfettiPiece key={i} index={i} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  piece: {
    position: 'absolute',
    top: 0,
    left: '50%',
    borderRadius: 2,
  },
});
