import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Sparkles, ArrowRight } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Button } from '@src/components/Button';
import { useTheme } from '@src/hooks/useTheme';
import { spacing, typography } from '@src/theme';

export default function Welcome() {
  const { t } = useTranslation();
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.gradientStart, theme.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <Animated.View entering={FadeInDown.delay(150).duration(500)} style={styles.brandRow}>
          <Sparkles size={26} color="#FFFFFF" />
          <Text style={[typography.h3, { color: '#FFFFFF', marginLeft: 8 }]}>
            Травел-Планер
          </Text>
        </Animated.View>

        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <Animated.View entering={FadeInUp.delay(250).duration(600)}>
            <Text style={[typography.display, styles.title]}>
              {t('onboarding.welcomeTitle')}
            </Text>
            <Text style={[typography.body, styles.subtitle]}>
              {t('onboarding.welcomeSubtitle')}
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(400).duration(600)} style={styles.actions}>
            <View style={styles.actionBtnWrap}>
              <Button
                label={t('onboarding.getStarted')}
                onPress={() => router.push('/(onboarding)/preferences')}
                variant="secondary"
                large
                iconRight={<ArrowRight size={18} color={theme.text} />}
                style={{ backgroundColor: '#FFFFFF', borderColor: '#FFFFFF' }}
              />
            </View>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1, paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl },
  brandRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md },
  title: {
    color: '#FFFFFF',
    marginBottom: spacing.md,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 17,
    lineHeight: 24,
  },
  actions: { marginTop: spacing.huge },
  actionBtnWrap: { width: '100%' },
});
