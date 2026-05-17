import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Screen } from '@src/components/Screen';
import { Button } from '@src/components/Button';
import { Slider } from '@src/components/Slider';
import { Card } from '@src/components/Card';
import { useTheme } from '@src/hooks/useTheme';
import { usePreferencesStore } from '@src/store/usePreferencesStore';
import { palette, spacing, typography } from '@src/theme';

export default function PreferencesOnboarding() {
  const { t } = useTranslation();
  const router = useRouter();
  const { theme } = useTheme();
  const { budget, speed, eco, setPriorities } = usePreferencesStore();

  return (
    <Screen scrollable>
      <Animated.View entering={FadeInUp.duration(450)}>
        <Text style={[typography.h1, { color: theme.text, marginTop: spacing.xl }]}>
          {t('onboarding.prefTitle')}
        </Text>
        <Text style={[typography.body, { color: theme.textMuted, marginTop: spacing.sm }]}>
          {t('onboarding.prefSubtitle')}
        </Text>
      </Animated.View>

      <Card style={{ marginTop: spacing.xxl }}>
        <View style={{ marginBottom: spacing.lg }}>
          <Slider
            label={t('search.budget')}
            value={budget}
            onChange={(v) => setPriorities({ budget: v })}
            accentColor={palette.warn500}
          />
        </View>
        <View style={{ marginBottom: spacing.lg }}>
          <Slider
            label={t('search.speed')}
            value={speed}
            onChange={(v) => setPriorities({ speed: v })}
            accentColor={palette.indigo500}
          />
        </View>
        <View>
          <Slider
            label={t('search.eco')}
            value={eco}
            onChange={(v) => setPriorities({ eco: v })}
            accentColor={palette.eco500}
          />
        </View>
      </Card>

      <View style={{ marginTop: spacing.xxxl }}>
        <Button
          label={t('common.next')}
          onPress={() => router.push('/(onboarding)/personalize')}
          iconRight={<ArrowRight size={18} color="#FFFFFF" />}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({});
