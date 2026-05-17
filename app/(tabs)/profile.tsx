import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Languages, Eye, MoonStar, User as UserIcon } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Card } from '@src/components/Card';
import { Chip } from '@src/components/Chip';
import { Slider } from '@src/components/Slider';
import { ModeIcon } from '@src/components/ModeIcon';
import { useTheme } from '@src/hooks/useTheme';
import { useHaptic } from '@src/hooks/useHaptic';
import { usePreferencesStore, ALL_MODES } from '@src/store/usePreferencesStore';
import { useUserStore } from '@src/store/useUserStore';
import { palette, radius, spacing, typography } from '@src/theme';
import type { Language } from '@src/i18n';
import i18n from '@src/i18n';

export default function Profile() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const haptic = useHaptic();
  const user = useUserStore();
  const prefs = usePreferencesStore();

  const switchLanguage = (lng: Language) => {
    haptic.light();
    prefs.setLanguage(lng);
    i18n.changeLanguage(lng);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <Animated.View entering={FadeInDown.duration(400)}>
            <Text style={[typography.h1, { color: theme.text }]}>{t('profile.title')}</Text>
          </Animated.View>

          <Card style={{ marginTop: spacing.lg }}>
            <View style={styles.userRow}>
              <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
                <UserIcon size={28} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[typography.h3, { color: theme.text }]}>{user.name}</Text>
                <Text style={[typography.caption, { color: theme.textMuted }]}>{user.email}</Text>
              </View>
            </View>
          </Card>

          <Text style={[typography.overline, styles.sectionTitle, { color: theme.textMuted }]}>
            {t('profile.preferences')}
          </Text>
          <Card>
            <View style={{ marginBottom: spacing.lg }}>
              <Slider
                label={t('search.budget')}
                value={prefs.budget}
                onChange={(v) => prefs.setPriorities({ budget: v })}
                accentColor={palette.warn500}
              />
            </View>
            <View style={{ marginBottom: spacing.lg }}>
              <Slider
                label={t('search.speed')}
                value={prefs.speed}
                onChange={(v) => prefs.setPriorities({ speed: v })}
                accentColor={palette.indigo500}
              />
            </View>
            <View>
              <Slider
                label={t('search.eco')}
                value={prefs.eco}
                onChange={(v) => prefs.setPriorities({ eco: v })}
                accentColor={palette.eco500}
              />
            </View>
          </Card>

          <Text style={[typography.overline, styles.sectionTitle, { color: theme.textMuted }]}>
            {t('profile.modes')}
          </Text>
          <Card>
            <View style={styles.modeGrid}>
              {ALL_MODES.map((m) => (
                <View key={m} style={{ marginRight: spacing.sm, marginBottom: spacing.sm }}>
                  <Chip
                    label={t(`modes.${m}`)}
                    selected={prefs.enabledModes.includes(m)}
                    icon={<ModeIcon mode={m} size={14} color={prefs.enabledModes.includes(m) ? '#FFFFFF' : theme.text} />}
                    onPress={() => prefs.toggleMode(m)}
                  />
                </View>
              ))}
            </View>
          </Card>

          <Text style={[typography.overline, styles.sectionTitle, { color: theme.textMuted }]}>
            {t('profile.accessibility')}
          </Text>
          <Card>
            <View style={styles.toggleRow}>
              <Eye size={20} color={theme.text} />
              <View style={styles.toggleCopy}>
                <Text style={[typography.bodyStrong, { color: theme.text }]}>
                  {t('profile.largeText')}
                </Text>
                <Text style={[typography.caption, { color: theme.textMuted }]}>
                  {t('profile.largeTextHint')}
                </Text>
              </View>
              <Switch
                value={prefs.largeText}
                onValueChange={(v) => {
                  haptic.light();
                  prefs.setLargeText(v);
                }}
                trackColor={{ false: theme.cardAlt, true: theme.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
            <View style={[styles.toggleRow, { marginTop: spacing.lg }]}>
              <MoonStar size={20} color={theme.text} />
              <View style={styles.toggleCopy}>
                <Text style={[typography.bodyStrong, { color: theme.text }]}>
                  {t('profile.simpleMode')}
                </Text>
                <Text style={[typography.caption, { color: theme.textMuted }]}>
                  {t('profile.simpleModeHint')}
                </Text>
              </View>
              <Switch
                value={prefs.simpleMode}
                onValueChange={(v) => {
                  haptic.light();
                  prefs.setSimpleMode(v);
                }}
                trackColor={{ false: theme.cardAlt, true: theme.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
          </Card>

          <Text style={[typography.overline, styles.sectionTitle, { color: theme.textMuted }]}>
            {t('profile.language')}
          </Text>
          <Card>
            <View style={styles.langRow}>
              <Languages size={20} color={theme.text} />
              <View style={{ flexDirection: 'row', marginLeft: spacing.md }}>
                <View style={{ marginRight: spacing.sm }}>
                  <Chip
                    label={t('profile.languages.en')}
                    selected={prefs.language === 'en'}
                    onPress={() => switchLanguage('en')}
                  />
                </View>
                <Chip
                  label={t('profile.languages.de')}
                  selected={prefs.language === 'de'}
                  onPress={() => switchLanguage('de')}
                />
              </View>
            </View>
          </Card>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: 140,
  },
  userRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  sectionTitle: { marginTop: spacing.xl, marginBottom: spacing.sm },
  modeGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  toggleRow: { flexDirection: 'row', alignItems: 'center' },
  toggleCopy: { flex: 1, marginLeft: spacing.md },
  langRow: { flexDirection: 'row', alignItems: 'center' },
});
