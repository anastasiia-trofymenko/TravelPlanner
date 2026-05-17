import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { Screen } from '@src/components/Screen';
import { HeaderBar } from '@src/components/HeaderBar';
import { Card } from '@src/components/Card';
import { Button } from '@src/components/Button';
import { Slider } from '@src/components/Slider';
import { Chip } from '@src/components/Chip';
import { ModeIcon } from '@src/components/ModeIcon';
import { ALL_MODES, usePreferencesStore } from '@src/store/usePreferencesStore';
import { useTheme } from '@src/hooks/useTheme';
import { palette, spacing, typography } from '@src/theme';
import { Text } from 'react-native';

export default function Filters() {
  const { t } = useTranslation();
  const router = useRouter();
  const { theme } = useTheme();
  const prefs = usePreferencesStore();

  return (
    <Screen scrollable>
      <HeaderBar title={t('search.advanced')} />
      <Card>
        <View style={{ gap: spacing.lg }}>
          <Slider
            label={t('search.budget')}
            value={prefs.budget}
            onChange={(v) => prefs.setPriorities({ budget: v })}
            accentColor={palette.warn500}
          />
          <Slider
            label={t('search.speed')}
            value={prefs.speed}
            onChange={(v) => prefs.setPriorities({ speed: v })}
            accentColor={palette.indigo500}
          />
          <Slider
            label={t('search.eco')}
            value={prefs.eco}
            onChange={(v) => prefs.setPriorities({ eco: v })}
            accentColor={palette.eco500}
          />
        </View>
      </Card>

      <Card style={{ marginTop: spacing.md }}>
        <Text style={[typography.bodyStrong, { color: theme.text, marginBottom: spacing.sm }]}>
          {t('search.modes')}
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {ALL_MODES.map((m) => (
            <View key={m} style={{ marginRight: 6, marginBottom: 6 }}>
              <Chip
                label={t(`modes.${m}`)}
                selected={prefs.enabledModes.includes(m)}
                icon={
                  <ModeIcon
                    mode={m}
                    size={12}
                    color={prefs.enabledModes.includes(m) ? '#FFFFFF' : theme.text}
                  />
                }
                onPress={() => prefs.toggleMode(m)}
              />
            </View>
          ))}
        </View>
      </Card>

      <View style={{ marginTop: spacing.xxxl }}>
        <Button label={t('common.done')} onPress={() => router.back()} />
      </View>
    </Screen>
  );
}
