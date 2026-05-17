import { useCallback, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '@src/hooks/useTheme';
import { useHaptic } from '@src/hooks/useHaptic';
import { radius, spacing, typography } from '@src/theme';

type Props = {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (v: number) => void;
  accentColor?: string;
  description?: string;
};

const KNOB = 26;

export const Slider = ({
  label,
  value,
  min = 0,
  max = 1,
  onChange,
  accentColor,
  description,
}: Props) => {
  const { theme } = useTheme();
  const haptic = useHaptic();
  const [width, setWidth] = useState(0);
  const accent = accentColor ?? theme.primary;

  const clamp = (v: number) => Math.min(max, Math.max(min, v));

  const px = useSharedValue<number>(0);
  const startPx = useSharedValue<number>(0);

  const updateFromPx = useCallback(
    (p: number) => {
      if (width <= 0) return;
      const ratio = Math.min(1, Math.max(0, p / (width - KNOB)));
      const next = clamp(min + ratio * (max - min));
      onChange(+next.toFixed(2));
    },
    [width, min, max, onChange],
  );

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    setWidth(w);
    const ratio = (value - min) / (max - min);
    px.value = ratio * (w - KNOB);
  };

  const handleHaptic = useCallback(() => {
    haptic.light();
  }, [haptic]);

  const pan = Gesture.Pan()
    .onStart(() => {
      startPx.value = px.value;
      runOnJS(handleHaptic)();
    })
    .onUpdate((e) => {
      const next = Math.min(width - KNOB, Math.max(0, startPx.value + e.translationX));
      px.value = next;
      runOnJS(updateFromPx)(next);
    })
    .onEnd(() => {
      px.value = withSpring(px.value, { damping: 20 });
    });

  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: px.value }],
  }));

  const fillStyle = useAnimatedStyle(() => ({
    width: px.value + KNOB / 2,
  }));

  return (
    <GestureHandlerRootView style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={[typography.bodyStrong, { color: theme.text }]}>{label}</Text>
        <Text style={[typography.caption, { color: theme.textMuted }]}>
          {Math.round(value * 100)}
        </Text>
      </View>
      {description ? (
        <Text style={[typography.caption, { color: theme.textMuted, marginBottom: spacing.sm }]}>
          {description}
        </Text>
      ) : null}
      <View style={[styles.track, { backgroundColor: theme.cardAlt }]} onLayout={onLayout}>
        <Animated.View style={[styles.fill, { backgroundColor: accent }, fillStyle]} />
        <GestureDetector gesture={pan}>
          <Animated.View
            style={[
              styles.knob,
              { backgroundColor: '#FFFFFF', borderColor: accent },
              knobStyle,
            ]}
          />
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  wrapper: { width: '100%' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  track: {
    height: 10,
    borderRadius: radius.pill,
    justifyContent: 'center',
  },
  fill: {
    position: 'absolute',
    left: 0,
    height: 10,
    borderRadius: radius.pill,
  },
  knob: {
    width: KNOB,
    height: KNOB,
    borderRadius: KNOB / 2,
    borderWidth: 4,
    top: -8,
    elevation: 4,
    shadowColor: '#0F172A',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
});
