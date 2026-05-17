import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import { Button } from '@src/components/Button';
import { Card } from '@src/components/Card';
import { ConfettiOverlay } from '@src/components/ConfettiOverlay';
import { useTripsStore } from '@src/store/useTripsStore';
import { useTheme } from '@src/hooks/useTheme';
import { spacing, typography, radius } from '@src/theme';
import { formatLongDate, formatClock } from '@src/utils/format';

export default function Success() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();
  const { tripId } = useLocalSearchParams<{ tripId?: string }>();
  const trip = useTripsStore((s) => (tripId ? s.getTrip(tripId) : undefined));

  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSequence(
      withDelay(80, withSpring(1, { damping: 10, stiffness: 140 })),
      withSpring(1, { damping: 14 }),
    );
  }, [scale]);

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <LinearGradient
        colors={[theme.gradientStart, theme.gradientEnd]}
        style={StyleSheet.absoluteFillObject}
      />
      <ConfettiOverlay />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <Animated.View entering={FadeIn.delay(200).duration(500)} style={styles.body}>
          <Animated.View style={[styles.checkCircle, checkStyle]}>
            <Check size={56} color={theme.primary} strokeWidth={3} />
          </Animated.View>
          <Text style={[typography.display, { color: '#FFFFFF', textAlign: 'center' }]}>
            {t('booking.successTitle')}
          </Text>
          <Text
            style={[
              typography.body,
              { color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginTop: spacing.md, fontSize: 16, lineHeight: 22 },
            ]}
          >
            {t('booking.successBody')}
          </Text>

          {trip ? (
            <Card style={styles.summary}>
              <Text style={[typography.overline, { color: theme.textMuted }]}>
                {t('common.departure')}
              </Text>
              <Text style={[typography.h3, { color: theme.text, marginTop: 2 }]}>
                {trip.route.origin.name} → {trip.route.destination.name}
              </Text>
              <Text style={[typography.caption, { color: theme.textMuted, marginTop: 4 }]}>
                {formatLongDate(trip.route.departureAt)} ·{' '}
                {formatClock(trip.route.departureAt)} → {formatClock(trip.route.arrivalAt)}
              </Text>
            </Card>
          ) : null}
        </Animated.View>

        <Animated.View entering={FadeIn.delay(600).duration(500)} style={{ gap: spacing.sm }}>
          {trip ? (
            <Button
              label={t('booking.viewTrip')}
              onPress={() => router.replace(`/trip/${trip.id}` as any)}
              variant="secondary"
              style={{ backgroundColor: '#FFFFFF', borderColor: '#FFFFFF' }}
            />
          ) : null}
          <Button
            label={t('booking.backHome')}
            variant="ghost"
            onPress={() => router.replace('/(tabs)')}
            style={{ borderColor: 'rgba(255,255,255,0.3)' }}
          />
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
    justifyContent: 'space-between',
  },
  body: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  checkCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    shadowColor: '#0F172A',
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  summary: {
    width: '100%',
    marginTop: spacing.xxl,
    borderRadius: radius.lg,
  },
});
