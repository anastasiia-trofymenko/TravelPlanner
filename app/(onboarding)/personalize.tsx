import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Leaf, Gauge, Smile, Type } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Screen } from '@src/components/Screen';
import { Button } from '@src/components/Button';
import { useTheme } from '@src/hooks/useTheme';
import { usePreferencesStore } from '@src/store/usePreferencesStore';
import { radius, shadows, spacing, typography } from '@src/theme';
import { useHaptic } from '@src/hooks/useHaptic';

type Style = 'eco' | 'fast' | 'casual' | 'simple';

const ICONS = {
  eco: Leaf,
  fast: Gauge,
  casual: Smile,
  simple: Type,
};

export default function Personalize() {
  const { t } = useTranslation();
  const router = useRouter();
  const { theme } = useTheme();
  const haptic = useHaptic();
  const applyStyle = usePreferencesStore((s) => s.applyStyle);
  const finish = usePreferencesStore((s) => s.finishOnboarding);
  const [selected, setSelected] = useState<Style | null>(null);

  const styles_: { key: Style; color: string }[] = [
    { key: 'eco', color: theme.eco },
    { key: 'fast', color: theme.accent },
    { key: 'casual', color: theme.primary },
    { key: 'simple', color: theme.textMuted },
  ];

  const onFinish = () => {
    if (selected) applyStyle(selected);
    finish();
    router.replace('/(tabs)');
  };

  return (
    <Screen scrollable>
      <Animated.View entering={FadeInUp.duration(450)}>
        <Text style={[typography.h1, { color: theme.text, marginTop: spacing.xl }]}>
          {t('onboarding.personalizeTitle')}
        </Text>
        <Text style={[typography.body, { color: theme.textMuted, marginTop: spacing.sm }]}>
          {t('onboarding.personalizeSubtitle')}
        </Text>
      </Animated.View>

      <View style={{ marginTop: spacing.xxl, gap: spacing.md }}>
        {styles_.map(({ key, color }) => {
          const Icon = ICONS[key];
          const active = selected === key;
          return (
            <Pressable
              key={key}
              onPress={() => {
                haptic.light();
                setSelected(key);
              }}
              style={[
                styles.option,
                shadows.sm,
                {
                  backgroundColor: theme.card,
                  borderColor: active ? color : theme.border,
                  borderWidth: active ? 2 : 1,
                },
              ]}
            >
              <View style={[styles.iconWrap, { backgroundColor: `${color}22` }]}>
                <Icon size={22} color={color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[typography.h3, { color: theme.text }]}>
                  {t(`onboarding.styles.${key}`)}
                </Text>
                <Text style={[typography.caption, { color: theme.textMuted, marginTop: 2 }]}>
                  {t(`onboarding.styles.${key}Desc`)}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={{ marginTop: spacing.xxxl, gap: spacing.sm }}>
        <Button label={t('onboarding.finish')} onPress={onFinish} />
        <Button label={t('common.skip')} variant="ghost" onPress={onFinish} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: radius.lg,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
});
